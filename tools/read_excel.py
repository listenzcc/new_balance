# File: read_excel.py
# Aim: Read data from excel file and convert it into DataFrame object

import os
import pandas as pd

# Setup excel path
excel_path = os.path.join(os.environ['ONEDRIVE'], 'Documents',
                          'newbalance.xlsx')
sheet_id = 1

try:
    # Read data into dataframe
    dataframe = pd.read_excel(excel_path, sheet_name=[sheet_id])[sheet_id]
    print(f'Read sheet ID: {sheet_id} from {excel_path}')
    print(f'Raw length is {len(dataframe)}')

    # Squeeze invalid rows
    dataframe = dataframe.loc[dataframe['科目'].notna()]
    print(f'Squeeze invalid rows, final length is {len(dataframe)}')

    # Save the dataframe
    save_path = os.path.join(os.path.dirname(__file__), '..', 'src',
                             'latest.json')
    dataframe.to_json(save_path)
    print(f'Saved in {save_path}')
except Exception as err:
    print(err)
    print(f'Reading {excel_path} failed.')
    dataframe = None
