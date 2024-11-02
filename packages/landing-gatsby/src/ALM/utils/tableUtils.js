// Utility function to generate table columns dynamically
export const generateColumns = (data) => {
  if (!data || data.length === 0) return [];

  const columnKeys = Object.keys(data[0]);

  return columnKeys.map((key) => ({
    title: key.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()), // Format title
    dataIndex: key,
    key,
    render: (value) => {
      if (typeof value === 'object' && value !== null) {
        return JSON.stringify(value, null, 2);
      }
      return value ? value.toString() : 'N/A';
    },
  }));
};

// Utility function to filter and show/hide specific columns based on user input
export const filterColumns = (columns, visibleKeys) => {
  return columns.filter((column) => visibleKeys.includes(column.key));
};

// Utility function to handle visibility changes dynamically
export const handleColumnVisibilityChange = (allColumns, visibleKeys, key, checked) => {
  if (checked) {
    const columnToShow = allColumns.find((col) => col.key === key);
    if (!visibleKeys.includes(columnToShow.key)) {
      return [...visibleKeys, columnToShow.key];
    }
  } else {
    return visibleKeys.filter((visibleKey) => visibleKey !== key);
  }
  return visibleKeys;
};
