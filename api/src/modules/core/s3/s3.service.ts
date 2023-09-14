import aws from 'aws-sdk';
import { nanoid } from 'nanoid';
import { Inject, Service } from 'typedi';
import URL from 'url';
import { ConfigService } from '../../../core';

interface getSignedUrlResponse {
  signedUrl: string;
}

@Service('S3Service')
export class S3Service {
  testMode: boolean;
  s3: aws.S3;
  params: any;

  constructor(@Inject('ConfigService') public readonly config: ConfigService) {
    this.testMode = process.env.NODE_ENV === 'test';
    this.params = {
      Bucket: config.get('S3_BUCKET_NAME'),
      Expires: Number(config.get('S3_BUCKET_SIGNED_URL_EXPIRES')),
    };
    // console.log('this.params :>> ', this.params);
    const s3Config = {
      region: config.get('S3_REGION'),
      accessKeyId: config.get('S3_ACCESS_KEY_ID'),
      secretAccessKey: config.get('S3_SECRET_ACCESS_KEY'),
      signatureVersion: 'v4',
    };
    // console.log('s3Config :>> ', s3Config);

    this.s3 = new aws.S3(s3Config);
  }

  async getSignedUrl(fileName: string): Promise<getSignedUrlResponse> {
    // NOTE: this is an anti-pattern.  I'm mocking this service out for tests by checking
    // to see if we're in test mode here.  We should actually use dependency injection in the
    // tests, but... time.
    if (this.testMode) {
      return {
        signedUrl: `https://www.foo.com/${fileName}`,
      };
    }

    /////////////////////////
    // Start non-test code
    try {
      const fileNameScrubbed = fileName.replace(/[^a-zA-Z0-9-_.]/g, '');
      const args = Object.assign(this.params, { Key: `${nanoid()}_${fileNameScrubbed}` });
      const signedUrl = await this.s3.getSignedUrlPromise('putObject', args);
      if (!signedUrl || (signedUrl.length && signedUrl.length < 1)) {
        throw new Error('Unable to get signed URL');
      }
      return Promise.resolve({ signedUrl });
    } catch (err: any) {
      return err;
    }
  }

  async headFile(urlString: string) {
    // console.log('headFile url :>> ', urlString);
    // NOTE: this is an anti-pattern.  I'm mocking this service out for tests by checking
    // to see if we're in test mode here.  We should actually use dependency injection in the
    // tests, but... time.
    if (this.testMode) {
      return {
        stuff: 'foo',
      };
    }

    /////////////////////////
    // Start non-test code
    // Turn full URL into the AWS Key
    const url = URL.parse(decodeURI(urlString));
    let path = url.pathname as string;
    if (!path) {
      throw new Error('Could not find file on AWS');
    }
    path = path.startsWith('/') ? path?.substring(1) : path;

    // console.log('path :>> ', path);

    const headPromise = new Promise((resolve, reject) => {
      this.s3.headObject(
        {
          Bucket: this.config.get('S3_BUCKET_NAME'),
          Key: path,
        },
        function (err, data) {
          if (err) {
            // console.log(err, err.stack);
            reject(err);
          } else {
            resolve(data);
          }
        }
      );
    });

    const headResult = await headPromise;
    // console.log('headResult :>> ', headResult);
    return headResult;
  }
}
