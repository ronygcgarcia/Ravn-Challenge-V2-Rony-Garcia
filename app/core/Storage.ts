import path from 'path';
import fs from 'fs';
import { UploadedFile } from 'express-fileupload';
import imageType, { ImageTypeResult } from 'image-type';
import disks from '../../configs/disk';
import LogicalException from '../../handlers/LogicalException';
import BadRequestException from '../../handlers/BadRequestException';

export default class Storage {
    static diskObject: {
        type?: string,
        path?: string
    } = {};

    static disk(name: keyof typeof disks) {
        Storage.diskObject = disks[name];

        return Storage;
    }

    static async put(options: { file: UploadedFile, mimeTypes?: string[] }) {
        const {
            file, mimeTypes = [],
        } = options;

        const mimeType = await file?.mimetype;
        if (mimeTypes.length && !mimeTypes.includes(mimeType)) {
            throw new BadRequestException('the format is not valid');
        }

        if (!Storage.diskObject) throw new LogicalException('ERR_INVALID_DISK', 'disk is not defined');

        const directory = path.dirname(`./storage/${Storage.diskObject.path}/${file.name}`);
        if (!fs.existsSync(directory)) {
            await fs.mkdirSync(directory, { recursive: true });
        }
        const type: ImageTypeResult | null = imageType(file.data)
        const filepath = `${file.md5}.${type?.ext}`;
        await fs.writeFileSync(`./storage/${Storage.diskObject.path}/${filepath}`, file.data);

        return {
            path: filepath,
            data: file.data,
        };
    }

    static async getFile(fileName: string, disk: keyof typeof disks) {
        if (!(typeof fileName === 'string')) throw new LogicalException('ERR_INVALID_PARAMS', 'fileName must be a string');
        if (!(typeof disk === 'string')) throw new LogicalException('ERR_INVALID_PARAMS', 'disk must be a string');

        const diskToRead = disks[disk];

        if (!diskToRead) throw new LogicalException('ERR_INVALID_DISK', 'disk is not defined');
        const pathToSearch = `${diskToRead.path}/${fileName}`;

        if (!fs.existsSync(`./storage/${pathToSearch}`)) throw new LogicalException('ERR_FILE_NOT_FOUND', 'file not found');
        const buffer = await fs.readFileSync(`./storage/${pathToSearch}`);

        const file = {
            path: pathToSearch,
            data: buffer as Buffer,
        };

        return file;
    }
}
