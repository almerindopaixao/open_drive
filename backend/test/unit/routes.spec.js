import { describe, it, expect, jest } from "@jest/globals";
import Routes from "../../src/Routes";

describe("#Routes test suite", () => {
    const defaultParams = {
        request: {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          method: "",
          body: {},
        },
        response: {
          setHeader: jest.fn(),
          writeHead: jest.fn(),
          end: jest.fn(),
        },
        values: () => Object.values(defaultParams),
    };

  describe("#io", () => {
    it("set io should store io instance", () => {
      const routes = new Routes();

      const ioObj = {
        to: (id) => ioObj,
        emit: (event, message) => {},
      };

      routes.io = ioObj;
      expect(routes.io).toStrictEqual(ioObj);
    });
  });

  describe("#handler", () => {

    it("given an inexistent route it should choose default route", async () => {
      const routes = new Routes();
      const params = {
        ...defaultParams,
      };

      params.request.method = "inexistent";
      await routes.handler(...params.values());

      expect(params.response.end).toHaveBeenCalledWith("hello world");
    });

    it("should set any request with CORS enabled", async () => {
      const routes = new Routes();
      const params = {
        ...defaultParams,
      };

      params.request.method = "inexistent";
      await routes.handler(...params.values());

      expect(params.response.setHeader).toHaveBeenCalledWith(
        "Access-Control-Allow-Origin",
        "*"
      );
    });

    it("given method OPTIONS it should choose options route", async () => {
      const routes = new Routes();
      const params = {
        ...defaultParams,
      };

      params.request.method = "OPTIONS";
      await routes.handler(...params.values());

      expect(params.response.writeHead).toHaveBeenCalledWith(204);
      expect(params.response.end).toHaveBeenCalled();
    });

    it("given method POST it should choose post route", async () => {
      const routes = new Routes();
      const params = {
        ...defaultParams,
      };

      params.request.method = "POST";
      jest.spyOn(routes, routes.post.name).mockResolvedValue();

      await routes.handler(...params.values());
      expect(routes.post).toHaveBeenCalled();
    });

    it("given method GET it should choose get route", async () => {
      const routes = new Routes();
      const params = {
        ...defaultParams,
      };

      params.request.method = "GET";
      jest.spyOn(routes, routes.get.name).mockResolvedValue();

      await routes.handler(...params.values());
      expect(routes.get).toHaveBeenCalled();
    });
  });

  describe("#get", () => {
    it("given method GET it should list all files downloaded", async () => {
        const logMock = {
            info_log: () => {},
        }; 

        const routes = new Routes(logMock);
        const params = { ...defaultParams };

        const filesStatusesMock = [
            {
              size: "453 B",
              lastModified: '2021-09-07T20:47:59.277Z',
              owner: 'almerindopaixao',
              file: 'file.txt',
            },
        ];

        jest.spyOn(routes.fileHelper, routes.fileHelper.getFilesStatus.name).mockResolvedValue(filesStatusesMock);
        jest.spyOn(routes.logger, routes.logger.info_log.name).mockResolvedValue();

        params.request.method = 'GET';
        await routes.handler(...params.values());

        expect(params.response.writeHead).toHaveBeenCalledWith(200);
        expect(params.response.end).toHaveBeenCalledWith(JSON.stringify(filesStatusesMock));
    });
  });
});
