import {execWhen} from './Utils';

execWhen(() => window.google && google.charts).then(() => {
    google.charts.load('current', {packages: ["orgchart"]});
});

function drawChart() {
    return new Promise((resolve, reject) => {
        execWhen(() => !!window.google).then(() => {
            google.charts.setOnLoadCallback(resolve);
        });
    });
}

export {drawChart};
