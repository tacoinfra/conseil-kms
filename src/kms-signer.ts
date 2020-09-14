import { Signer, SignerCurve } from 'conseiljs'
import { TezosKmsClient } from '@tacoinfra/tezos-kms'

/**
 * Creates a ConseilJS compatible Signer for keys stored in AWS KMS.
 */
export default class KmsSigner implements Signer {
  private readonly kmsClient: TezosKmsClient

  /**
   * Create a new `Signer` which wraps an AWS KMS key.
   *
   * @param kmsKeyId The Key ID in KMS.
   * @param region The AWS region the KMS Key resides in.
   */
  public constructor(kmsKeyId: string, region: string) {
    this.kmsClient = new TezosKmsClient(kmsKeyId, region)
  }

  public getSignerCurve(): SignerCurve {
    return SignerCurve.SECP256K1
  }

  public async signOperation(bytes: Buffer): Promise<Buffer> {
    return this.kmsClient.signOperation(bytes)
  }

  public signText(_message: string): Promise<string> {
    throw new Error('Unsupported: Cannot use `signText` in AwsKmsSigner')
  }

  public signTextHash(_message: string): Promise<string> {
    throw new Error('Unsupported: Cannot use `signTextHash` in AwsKmsSigner')
  }
}
