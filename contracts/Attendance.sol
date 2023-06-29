// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 <0.9.0;

contract Attendance {
    struct AttendanceRecord {
        uint256 id;
        uint256 date;
        string idNumber;
    }

    AttendanceRecord[] public attendanceRecords;
    uint256 public idCounter;

    function addAttendance(string memory _idNumber, uint256 _date) public {
        uint256 _id = idCounter++;

        AttendanceRecord memory newAttendance = AttendanceRecord({
            id: _id,
            date: _date,
            idNumber: _idNumber
        });

        attendanceRecords.push(newAttendance);
    }

    function getAllAttendance() public view returns (AttendanceRecord[] memory) {
        return attendanceRecords;
    }
}
