import math
import rclpy
from rclpy.node import Node
from geometry_msgs.msg import PoseStamped, PoseWithCovarianceStamped

class GoalDecider(Node):
    def __init__(self):
        super(GoalDecider, self).__init__(node_name='goal_publisher')
        self.publisher = self.create_publisher(PoseStamped, '/goal_pose', 10)
        self.create_subscription(PoseWithCovarianceStamped, '/amcl_pose', self.decide_goal)
        self.goal_decision = {
            'start':{'linear': {'x': 0.0, 'y': 0.0, 'z': 0.0}, 'angular': {'x': 0.0, 'y': 0.0, 'z': 0.0, 'w': 1.0}},
            'cross_pipe': {'linear': {'x': 20.0, 'y': 10.0, 'z': 0.0}, 'angular': {'x': 0.0, 'y': 0.0, 'z': 0.0, 'w': 1.0}},
            'boxes': {'linear': {'x': 10.0, 'y': 20.0, 'z': 0.0}, 'angular': {'x': 0.0, 'y': 0.0, 'z': 0.0, 'w': 1.0}},
            'arm_part': {'linear': {'x': 20.0, 'y': 10.0, 'z': 0.0}, 'angular': {'x': 0.0, 'y': 0.0, 'z': 0.0, 'w': 1.0}},
            }

    def calculate_distance(self, current_location: PoseWithCovarianceStamped, goal_location: dict):
        return math.sqrt((current_location.pose.pose.position.x - goal_location['linear']['x']) + (current_location.pose.pose.position.y - goal_location['linear']['y']) + (current_location.pose.pose.position.z - goal_location['linear']['z']))

    def decide_goal(self, location_message: PoseWithCovarianceStamped):
        distances = []
        for goal_name in self.goal_decision:
            distance = self.calculate_distance(location_message, self.goal_decision[goal_name])
            distances.append(distance)
        # distances = [self.calculate_distance(location_message, self.goal_decision[goal_name]) for goal_name in self.goal_decision if self.calculate_distance(location_message, self.goal_decision[goal_name]) > 0.0]
        closest_goal, goal_location = list(self.goal_decision.items())[distances.index(min(distances))]
        goal = PoseStamped()
        goal.pose.position.x = goal_location['linear']['x']
        goal.pose.position.y = goal_location['linear']['y']
        goal.pose.position.z = goal_location['linear']['z']
        self.publisher.publish(goal)
        self.get_logger().info(f'Goal set to {closest_goal}')

def main(args=None):
    rclpy.init(args=args)
    node = GoalDecider()
    rclpy.spin(node)
    node.destroy_node()
    rclpy.shutdown()
