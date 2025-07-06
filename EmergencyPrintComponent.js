const React = require('react');

// Very basic component with no dependencies
const EmergencyPrintComponent = React.forwardRef(function EmergencyPrintComponent(props, ref) {
  return React.createElement('div', { ref: ref, style: { padding: '20px' } },
    React.createElement('h2', null, 'Emergency Print Component'),
    React.createElement('p', null, 'Name: ' + (props.form?.fullName || 'N/A')),
    React.createElement('p', null, 'ID: ' + (props.form?.fileNumber || 'N/A'))
  );
});

// Using CommonJS exports to avoid any potential issues with ES modules
module.exports = EmergencyPrintComponent;