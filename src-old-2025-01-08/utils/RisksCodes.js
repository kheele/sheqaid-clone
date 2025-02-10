
class RisksCodes {
    static get list() {
        return ["Low", "Medium", "High", "Very High"];
    }
    static get radioList() {
        return RisksCodes.list.map(text => {
            return {text, value: text};
        });
    }

    static calcRiskRank(n) {
        let status;
        if (n <= 4) {
            status = 'Low';
        } else if (n <= 8) {
            status = 'Medium';
        } else if (n <= 15) {
            status = 'High';
        } else {
            status = 'Very High';
        }
        return status;
    }

    static color(level) {
        let color;
        if (level === "Very High") {
            color = 'red';
        } else if (level === "High") {
            color = 'orange';
        } else if (level === "Medium") {
            color = 'yellow';
        } else if (level === "Low") {
            color = 'green';
        }
        return color;
    }

    static colorClassName(level) {
        const color = RisksCodes.color(level);
        if (color) {
            return color + ' color-light';
        } else {
            return '';
        }
    }
}

export default RisksCodes;