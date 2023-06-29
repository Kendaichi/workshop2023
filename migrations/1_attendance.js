var Attendance = artifacts.require("./Attendance.sol");

module.exports = function (deployer) {
  deployer.deploy(Attendance);
};
