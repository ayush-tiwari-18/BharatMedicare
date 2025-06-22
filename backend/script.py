import tensorflow as tf
import numpy as np
import sys
import os
from tensorflow.keras.preprocessing.image import load_img, img_to_array

try:
    raw_args = sys.argv[1:]
    if len(raw_args) != 6:
        raise ValueError("Usage: script.py <min> <max> <age> <gender> <area> <image_path>")

    # Parse arguments
    minimum = float(raw_args[0])
    maximum = float(raw_args[1])
    age     = float(raw_args[2])
    gender  = int(raw_args[3])  # 1 for male, 0 for female
    area    = raw_args[4]
    image_path = raw_args[5]


    if not os.path.exists(image_path):
        raise FileNotFoundError(f"Image not found at path: {image_path}")

    # Load model
    model_path = os.path.join(os.path.dirname(__file__), "best_model.h5")
    model = tf.keras.models.load_model(model_path)

    # Preprocess image
    img = load_img(image_path, target_size=(224, 224))
    arr = img_to_array(img) / 255.0
    inpimg = np.array([arr], dtype='float32')

    # Prepare tabular input
    inptab = [[age, gender, maximum, minimum, 0, 0, 0, 0, 0]]

    # One-hot encode area
    area_map = {
        "anterior_torso": 4,
        "head_neck": 5,
        "lower_extremity": 6,
        "posterior_torso": 7
    }
    if area in area_map:
        inptab[0][area_map[area]] = 1
    else:
        inptab[0][8] = 1  # other

    inptab = np.array(inptab, dtype='float32')

    prob = model.predict([inpimg, inptab], verbose=0)[0][0] * 100

    print(f"{prob}", flush=True)  # Output ONLY the number

except Exception as e:
    print("❌ Error in script.py:", e, flush=True)
    sys.exit(1)
