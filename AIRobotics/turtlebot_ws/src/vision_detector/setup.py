import os
from glob import glob
from setuptools import find_packages, setup

package_name = 'vision_detector'

setup(
    name=package_name,
    version='0.0.0',
    packages=find_packages(exclude=['test']),
    data_files=[
        ('share/ament_index/resource_index/packages', ['resource/' + package_name]),
        ('share/' + package_name, ['package.xml']),
        (os.path.join('share', package_name, 'weight'), glob('weight/*')),
    ],
    install_requires=['setuptools'],
    zip_safe=True,
    maintainer='bhavya-shah',
    maintainer_email='bhavyashah2409@gmail.com',
    description='TODO: Package description',
    license='TODO: License declaration',
    tests_require=['pytest'],
    entry_points={
        'console_scripts': [
            'object_detection = vision_detector.object_detection:main',
        ],
    },
)
