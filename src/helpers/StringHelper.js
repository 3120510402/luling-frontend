const moment = require("moment");

const StringHelper = {
  datetime: (time) => {
    return moment(time).zone(7).format('DD MMMM YYYY, HH:mm');
  },
};

export default StringHelper;
