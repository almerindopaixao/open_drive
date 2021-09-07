import FileHelper from "./services/FileHelper.js";
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const defaultDownloadsFolder = resolve(__dirname, '../', 'downloads');

class Routes {
  _io;

  constructor(logger, downloadsFolder = defaultDownloadsFolder) {
    this._logger = logger;
    this._downloadsFolder = downloadsFolder;
    this._fileHelper = FileHelper;
  }

  set io(io) {
    this._io = io;
  }

  get io() {
    return this._io;
  }

  get fileHelper() {
    return this._fileHelper;
  }

  get logger() {
    return this._logger;
  }

  async defaultRoute(request, response) {
    response.end("hello world");
  }

  async options(request, response) {
    response.writeHead(204);
    response.end();
  }

  async post(request, response) {
    this._logger.info_log('post');
    response.end();
  }

  async get(request, response) {
    this.logger.info_log('GET');
    const files = await this.fileHelper.getFilesStatus(this._downloadsFolder);

    response.writeHead(200);
    response.end(JSON.stringify(files));
  }

  async handler(request, response) {
    response.setHeader('Access-Control-Allow-Origin', '*');
    const chosen = this[request.method.toLowerCase()] || this.defaultRoute;

    return chosen.apply(this, [request, response]);
  }
}

export default Routes;
