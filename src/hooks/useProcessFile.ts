import Papa from 'papaparse'; // CSV parsing library (install via `npm install papaparse`)
import * as XLSX from 'xlsx'; // Excel parsing library

// Function to process and format the CSV file
export const processCSVFile = (
  file: File,
  onSuccess: (data: any[]) => void,
  onError: (error: Error) => void,
) => {
  if (!file.name.endsWith('.csv')) {
    onError(new Error('Invalid file type. Please upload a .csv file.'));
    return;
  }

  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: (results) => {
      try {
        const formattedData = results.data.map((row: any) => ({
          dateTime: row['Date/Time'],
          name: row.Name,
          status: row.Status,
          number: row['No.'],
        }));

        onSuccess(formattedData);
      } catch (error: any) {
        onError(new Error('Error processing file data.', error));
      }
    },
    error: (error) => {
      onError(error);
    },
  });
};

// Function to process Excel files for payroll data
export const processExcelFile = (
  file: File,
  onSuccess: (data: any[]) => void,
  onError: (error: Error) => void,
) => {
  if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
    onError(new Error('Invalid file type. Please upload an Excel file (.xlsx or .xls).'));
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });

      console.warn('=== EXCEL FILE PARSING DEBUG ===');
      console.warn('Workbook sheet names:', workbook.SheetNames);

      // Get the first worksheet
      const firstSheetName = workbook.SheetNames[0];
      if (!firstSheetName) {
        onError(new Error('Excel file contains no worksheets.'));
        return;
      }
      const worksheet = workbook.Sheets[firstSheetName as string];

      console.warn('Worksheet range:', worksheet!['!ref']);
      console.warn('Raw worksheet data:', worksheet);

      // Convert to JSON with header row
      const jsonData = XLSX.utils.sheet_to_json(worksheet!, { header: 1 });

      console.warn('JSON data from Excel (first 10 rows):', jsonData.slice(0, 10));

      if (jsonData.length < 9) {
        onError(new Error('Excel file must contain at least 9 rows (rows 1-8 for headers/metadata + at least 1 data row).'));
        return;
      }

      // Handle the actual Excel structure:
      // Row 5 (index 4): First header row
      // Row 6 (index 5): Second header row (deductions/additional fields)
      // Row 9 (index 8): First data row
      const firstHeaderRow = jsonData[4] as string[]; // Row 5
      const secondHeaderRow = jsonData[5] as string[]; // Row 6
      const rows = jsonData.slice(8) as any[][]; // Start from Row 9

      console.warn('Processing Excel with split headers');
      console.warn('First header row (Row 5):', firstHeaderRow);
      console.warn('Second header row (Row 6):', secondHeaderRow);
      console.warn('First headers as strings:', firstHeaderRow.map(h => `"${h}"`));
      console.warn('Second headers as strings:', secondHeaderRow.map(h => `"${h}"`));

      // Combine headers intelligently - use first row primarily, fill gaps with second row
      const combinedHeaders = firstHeaderRow.map((header, index) => {
        // If first row header is empty or just whitespace, use second row
        if (!header || header.toString().trim() === '') {
          return secondHeaderRow[index] ? secondHeaderRow[index].toString().trim() : '';
        }
        return header.toString().trim();
      });

      console.warn('Combined headers:', combinedHeaders);
      console.warn('Combined headers as strings:', combinedHeaders.map(h => `"${h}"`));
      console.warn('Number of data rows:', rows.length);
      console.warn('First data row (Row 9):', rows[0]);

      const formattedData = rows
        .filter(row => row.some(cell => cell !== undefined && cell !== null && cell !== ''))
        .map((row, rowIndex) => {
          const obj: any = {};
          combinedHeaders.forEach((header, index) => {
            if (header) {
              obj[header] = row[index];
            }
          });

          // Debug the first few rows
          if (rowIndex < 3) {
            console.warn(`Data Row ${rowIndex + 1} (Excel Row ${rowIndex + 9}) formatted:`, obj);
          }

          return obj;
        });

      console.warn('Total formatted records:', formattedData.length);
      console.warn('First formatted record:', formattedData[0]);
      console.warn('================================');

      onSuccess(formattedData);
    } catch (error: any) {
      console.error('Excel parsing error:', error);
      onError(new Error(`Error processing Excel file: ${error.message}`));
    }
  };

  reader.onerror = () => {
    onError(new Error('Error reading Excel file'));
  };

  reader.readAsArrayBuffer(file);
};

// Function to find employee data from salaries file only
export const findEmployeeInSalariesFile = (
  employeeId: string,
  salariesData: any[],
): { salaryData?: any; error?: string; debugInfo?: any } => {
  try {
    // Debug: Log available column names
    const salaryColumns = salariesData.length > 0 ? Object.keys(salariesData[0]) : [];

    console.warn('Available salary columns:', salaryColumns);
    console.warn('Salary columns as strings:', salaryColumns.map(col => `"${col}"`));
    console.warn('First salary record:', salariesData[0]);
    console.warn('Searching for employee ID:', employeeId);

    // Find salary data with comprehensive search
    const salaryData = salariesData.find((sal: any) => {
      // First, log this salary record for debugging
      console.warn('Checking salary record:', sal);

      // Check the exact "Employee ID" field as used in the Python script
      const employeeIdField = sal['Employee ID'];
      console.warn(`Checking "Employee ID" field with value:`, employeeIdField, 'Type:', typeof employeeIdField);

      if (employeeIdField !== null && employeeIdField !== undefined) {
        const stringValue = employeeIdField.toString().trim();
        const searchId = employeeId.trim();

        console.warn(`Comparing "Employee ID": "${stringValue}" === "${searchId}"`);

        if (stringValue === searchId) {
          console.warn(`✅ Found employee in "Employee ID" field with value: ${employeeIdField}`);
          return true;
        }
      }

      // Fallback: Check all possible field variations for Employee ID
      const possibleFields = Object.keys(sal).filter(key =>
        key.toLowerCase().includes('employee') && key.toLowerCase().includes('id'),
      );

      console.warn('Fallback - Possible Employee ID fields found:', possibleFields);

      for (const field of possibleFields) {
        const value = sal[field];
        console.warn(`Fallback checking field "${field}" with value:`, value, 'Type:', typeof value);

        if (value !== null && value !== undefined) {
          const stringValue = value.toString().trim();
          const searchId = employeeId.trim();

          console.warn(`Fallback comparing "${stringValue}" === "${searchId}"`);

          if (stringValue === searchId) {
            console.warn(`✅ Found employee in fallback field: ${field} with value: ${value}`);
            return true;
          }
        }
      }

      return false;
    });

    if (!salaryData) {
      // Show available employee IDs for debugging
      const availableIds = salariesData.slice(0, 10).map((sal, index) => {
        const employeeIdValue = sal['Employee ID'] || sal['EMPLOYEE ID'] || sal.employeeId || sal.CNIC || sal.cnic;
        return `Row ${index + 1}: ${employeeIdValue || 'No ID found'}`;
      });

      return {
        error: `Employee with ID ${employeeId} not found in salaries file`,
        debugInfo: {
          availableColumns: salaryColumns,
          sampleIds: availableIds,
          searchedId: employeeId,
        },
      };
    }

    return { salaryData };
  } catch (error: any) {
    return { error: `Error processing salary data: ${error.message}` };
  }
};

// Keep the old function for backward compatibility but mark it as deprecated
export const findEmployeeInFiles = (
  employeeId: string,
  salariesData: any[],
  employeesData: any[],
): { salaryData?: any; employeeData?: any; error?: string; debugInfo?: any } => {
  try {
    // Debug: Log available column names from both files
    const employeeColumns = employeesData.length > 0 ? Object.keys(employeesData[0]) : [];
    const salaryColumns = salariesData.length > 0 ? Object.keys(salariesData[0]) : [];

    console.warn('=== DEBUGGING FILE COLUMNS ===');
    console.warn('Employee CSV columns:', employeeColumns);
    console.warn('Employee columns as strings:', employeeColumns.map(col => `"${col}"`));
    console.warn('Salary Excel columns:', salaryColumns);
    console.warn('Salary columns as strings:', salaryColumns.map(col => `"${col}"`));
    console.warn('First employee record:', employeesData[0]);
    console.warn('First salary record:', salariesData[0]);
    console.warn('Searching for employee ID:', employeeId);
    console.warn('===============================');

    // For individual processing, we only need salaries data
    const result = findEmployeeInSalariesFile(employeeId, salariesData);
    return {
      salaryData: result.salaryData,
      employeeData: result.salaryData, // Use salary data as employee data since it contains all info
      error: result.error,
      debugInfo: result.debugInfo,
    };
  } catch (error: any) {
    return { error: `Error in findEmployeeInFiles: ${error.message}` };
  }
};
