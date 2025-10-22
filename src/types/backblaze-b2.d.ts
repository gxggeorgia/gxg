declare module 'backblaze-b2' {
  export default class B2 {
    constructor(options: {
      applicationKeyId: string;
      applicationKey: string;
      accountId?: string;
    });
    downloadUrl?: string;
    authorize(): Promise<any>;
    listBuckets(): Promise<any>;
    getUploadUrl(options: { bucketId: string }): Promise<any>;
    uploadFile(options: {
      uploadUrl: string;
      uploadAuthToken: string;
      fileName: string;
      data: Buffer;
      contentType: string;
    }): Promise<any>;
    getDownloadAuthorization(options: {
      bucketId: string;
      fileNamePrefix: string;
      validDurationInSeconds: number;
    }): Promise<any>;
    listFileNames(options: {
      bucketId: string;
      prefix: string;
      maxFileCount: number;
    }): Promise<any>;
    deleteFileVersion(options: { fileId: string; fileName: string }): Promise<any>;
  }
}
