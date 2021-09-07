import { describe, it, expect, jest } from "@jest/globals";
import fs from "fs";
import FileHelper from "../../src/services/FileHelper.js";

describe("#FileHelper", () => {
  describe("#getFileStatus", () => {
    it("should return files statuses in correct format", async () => {
      const statMock = {
        dev: 1589178896,
        mode: 33206,
        nlink: 1,
        uid: 0,
        gid: 0,
        rdev: 0,
        blksize: 4096,
        ino: 5629499535078188,
        size: 453,
        blocks: 8,
        atimeMs: 1631048209971.813,
        mtimeMs: 1631048209915,
        ctimeMs: 1631048209914.8018,
        birthtimeMs: 1631047679276.7517,
        atime: "2021-09-07T20:56:49.972Z",
        mtime: "2021-09-07T20:56:49.915Z",
        ctime: "2021-09-07T20:56:49.915Z",
        birthtime: "2021-09-07T20:47:59.277Z",
      };

      const mockUser = "almerindopaixao";
      process.env.USER = mockUser;
      const filename = "file.txt";

      jest
        .spyOn(fs.promises, fs.promises.readdir.name)
        .mockResolvedValue([filename]);

      jest
        .spyOn(fs.promises, fs.promises.stat.name)
        .mockResolvedValue(statMock);

      const result = await FileHelper.getFilesStatus("/tmp");

      const expectedResult = [
        {
          size: "453 B",
          lastModified: statMock.birthtime,
          owner: mockUser,
          file: filename,
        },
      ];

      expect(fs.promises.stat).toHaveBeenCalledWith(`/tmp/${filename}`);
      expect(result).toMatchObject(expectedResult);
    });
  });
});
