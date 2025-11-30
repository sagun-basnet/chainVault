// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract FileLog {
    struct Log {
        string fileHash;
        string action; // "UPLOAD", "SHARE", "DELETE", "UPDATE"
        string userId;
        uint256 timestamp;
        string metadata; // Optional: extra info like filename or share link
    }

    Log[] public logs;

    event FileAction(
        string indexed fileHash,
        string action,
        string indexed userId,
        uint256 timestamp,
        string metadata
    );

    function addLog(
        string memory _fileHash,
        string memory _action,
        string memory _userId,
        string memory _metadata
    ) public {
        Log memory newLog = Log({
            fileHash: _fileHash,
            action: _action,
            userId: _userId,
            timestamp: block.timestamp,
            metadata: _metadata
        });

        logs.push(newLog);

        emit FileAction(_fileHash, _action, _userId, block.timestamp, _metadata);
    }

    function getLogsCount() public view returns (uint256) {
        return logs.length;
    }

    function getLog(uint256 _index) public view returns (Log memory) {
        require(_index < logs.length, "Index out of bounds");
        return logs[_index];
    }
    
    function getAllLogs() public view returns (Log[] memory) {
        return logs;
    }
}
