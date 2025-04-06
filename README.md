# DevilsInventHackathon
This README.md file showcases the training results of an object detection model, visualizing key performance metrics and data samples across training and validation phases. Using a deep learning framework (YOLO-based), the model has been trained to detect multiple object classes, as demonstrated through annotated batch images and comprehensive evaluation curves.

## The included visualizations highlight:

### Model performance metrics:
 Precision-Recall (PR) 
![Precision-Recall (PR) curve](train_results/PR_curve.png)

F1-score 
![F1-score curve](train_results/F1_curve.png)

Precision (P) 
![Precision (P) curve](train_results/P_curve.png) 

Recall (R) 
![Recall (R) curve](train_results/R_curve.png) 

### Confusion matrices: 
Both raw and normalized views to assess prediction quality across classes.

Raw view
![Raw view](train_results/confusion_matrix.png)

Normalized view
![Normalized view](train_results/confusion_matrix_normalized.png)

### Data distributions: 
Label heatmaps and correlation diagrams for understanding label frequency and co-occurrence.

Label heatmap
![Label heatmap](train_results/labels.jpg)

Label correlation diagram
![Label correlation diagram](train_results/labels_correlogram.jpg)

### Training batches: 
Snapshots of labeled and predicted outputs during both training and validation phases.
#### Traning Phase
 ![Traning Phase](train_results/train_batch201.jpg)![Traning Phase](train_results/train_batch202.jpg) 
 ![Traning Phase](train_results/train_batch2.jpg)
 ![Traning Phase](train_results/train_batch0.jpg)
 ![Traning Phase](train_results/train_batch1.jpg)
 ![Traning Phase](train_results/train_batch200.jpg)

#### Validation Phase
![Val Phase](train_results/val_batch0_labels.jpg)
![Val Phase](train_results/val_batch0_pred.jpg)


This collection provides valuable insights into the model's behavior, strengths, and potential areas for improvement, making it a useful artifact for evaluating object detection workflows in research or deployment scenarios


