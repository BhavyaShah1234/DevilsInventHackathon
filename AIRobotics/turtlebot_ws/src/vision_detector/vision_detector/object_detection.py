import os
import cv2 as cv
import rclpy as r
import torch as t
import cv_bridge as c
import subprocess as s
from rclpy.node import Node
from ultralytics import YOLO
from sensor_msgs.msg import Image
from vision_msg.msg import ObjectDetection
from ament_index_python.packages import get_package_share_directory

class ObjectDetector(Node):
    def __init__(self):
        super(ObjectDetector, self).__init__(node_name='object_detection')
        self.ffmpeg_process = None
        self.rtsp_url = 'rtsp://10.157.220.96:8554/honeywell'
        self.declare_parameter('weights_file', 'best.pt')
        weight_file = self.get_parameter('weights_file').get_parameter_value().string_value
        package_share = get_package_share_directory('vision_detector')
        weight_path = os.path.join(package_share, 'weight', weight_file)
        self.yolo_model = YOLO(weight_path)
        self.converter = c.CvBridge()
        self.classes = ['cross_pipe', 'arm_part', 'box']
        self.colors = {'cross_pipe': (255, 0, 0), 'arm_part': (0, 255, 0), 'box': (0, 0, 255)}
        self.bbox_publisher = self.create_publisher(ObjectDetection, '/bbox', 10)
        self.create_subscription(Image, '/camera/image_raw', self.callback, 10)

    def start_ffmpeg(self):
        command = [
            'ffmpeg',
            '-re',
            '-f', 'rawvideo',
            '-pix_fmt', 'bgr24',
            '-s', '416x256', # Adjust resolution as needed
            '-r', '30',
            '-i', '-',
            '-f', 'rtsp',
            '-rtsp_transport', 'tcp',
            '-c:v', 'libx264',
            '-preset', 'ultrafast',
            '-tune', 'zerolatency',
            '-q', '5',
            '-an',
            '-x264-params', 'keyint=30:scenecut=0',
            '-g', '30',
            self.rtsp_url
        ]
        self.ffmpeg_process = s.Popen(command, stdin=s.PIPE)

    def callback(self, image_message: Image):
        if self.ffmpeg_process is None:
            self.start_ffmpeg()
        image = self.converter.imgmsg_to_cv2(image_message, desired_encoding='bgr8')
        self.get_logger().info(f"Image size: {image.shape}")
        results = self.yolo_model(image, device='0' if t.cuda.is_available() else 'cpu')[0].boxes.data.cpu().numpy().tolist()
        image = cv.resize(image, (416, 256))  # Match FFmpeg input dimensions
        self.get_logger().info(f"========================= {results}")
        detection_message = ObjectDetection()
        detection_message.objects = len(results)
        detection_message.xmin = []
        detection_message.ymin = []
        detection_message.xmax = []
        detection_message.ymax = []
        detection_message.conf = []
        detection_message.classes = []
        for xmin, ymin, xmax, ymax, conf, c in results:
            detection_message.xmin.append(int(xmin))
            detection_message.ymin.append(int(ymin))
            detection_message.xmax.append(int(xmax))
            detection_message.ymax.append(int(ymax))
            detection_message.conf.append(conf)
            detection_message.classes.append(self.classes[int(c)])
            image = cv.rectangle(image, (int(xmin), int(ymin)), (int(xmax), int(ymax)), self.colors[self.classes[int(c)]], 2)
            image = cv.putText(image, f'{self.classes[int(c)]}: {round(conf * 100, 2)}', (int(xmin), int(ymin) - 10), cv.FONT_HERSHEY_PLAIN, 1, self.colors[self.classes[int(c)]], 1)
        self.bbox_publisher.publish(detection_message)
        try:
            self.ffmpeg_process.stdin.write(image.tobytes())
            self.ffmpeg_process.stdin.flush()
        except Exception as e:
            self.get_logger().error(f"{e}")

    def __del__(self):
        if hasattr(self, 'ffmpeg_process') and self.ffmpeg_process:
            self.ffmpeg_process.stdin.close()
            self.ffmpeg_process.wait()

def main(args=None):
    r.init(args=args)
    yolo_node = ObjectDetector()
    r.spin(yolo_node)
    yolo_node.destroy_node()
    r.shutdown()

if __name__ == '__main__':
    main()
