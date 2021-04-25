# Notes on chapter 4

We replace Azure Storage with AWS S3. Brief outline of what's needed:

* Create S3 bucket from [Amazon S3 console](https://s3.console.aws.amazon.com/s3/home).
* Create a `video-storage` microservice.
* Install [aws-sdk](https://www.npmjs.com/package/aws-sdk) in that service.
* Follow official code examples (though we actually probably won't need exactly that right now, but rather how to just stream videos from a bucket). **Beware**, the new 3.x SDK has been released on [Dec. 15th, 2020](https://github.com/aws/aws-sdk-js-v3/compare/v1.0.0-rc.10...v3.0.0). So we have to choose between:

    * [Amazon S3 Node.js Examples (v2)](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/s3-node-examples.html), [Kindle version](https://www.amazon.com/dp/B07WRGJ3JH)
    * [AWS SDK for JS v3 Developer Guide](https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/welcome.html#welcome_node) and [AWS SDK for JS v3 API reference](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/index.html).
* Follow answers to the question [Streaming file from S3 with Express including information on length and filetype](https://stackoverflow.com/questions/35782434/streaming-file-from-s3-with-express-including-information-on-length-and-filetype) on S.O.

For now, let's just stick to v2.

[EDIT] after getting streaming from S3 to work, here's what's left to do:

* Use env vars OR the `~/.aws/config` file (the latter being the default, but less suited for deployment)
* Remove default value for PORT, exit on missing vars
* Have streaming service get video from S3 instead of fs
* (re)publish Docker image for streaming, initial publish for storage
* Add Compose file
* Add MongoDB