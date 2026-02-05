// Handlebars helpers
export const helpers = {
    // Format currency
    formatCurrency: function(value) {
        if (!value) return '0';
        return new Intl.NumberFormat('vi-VN').format(value);
    },
    
    // Format date
    formatDate: function(date) {
        if (!date) return '';
        const d = new Date(date);
        return d.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    },
    
    // Check equality
    eq: function(a, b) {
        return a === b;
    },
    
    // Increment index (start from 1)
    inc: function(value) {
        return parseInt(value) + 1;
    },
    
    // Greater than
    gt: function(a, b) {
        return a > b;
    }
};
