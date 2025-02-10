
const changeColors = (dialog, val) => {
    try {
        const node = dialog.getDOMNode();
        if (node) {
            const jqEl = $(node.querySelector('.dialog-header'));
            const backBtn = jqEl.find('.page-back-btn');
            if (val) {
                const {background, color} = val;
                jqEl.css({background}).find('h3').css({color});
                backBtn.css({color: val.backBtn || color});
            } else {
                jqEl.css({background: '#f5f5f5'}).find('h3').css({color: '#888'});
                backBtn.css({color: '#777'});
            }
        }
    } catch (e) {

    }
};

export {changeColors};