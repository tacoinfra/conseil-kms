import { KeyStore, KeyStoreCurve, KeyStoreType } from 'conseiljs'
import { TezosKmsClient } from '@tacoinfra/tezos-kms'

/**
 * Creates a ConseilJS compatible KeyStore for keys stored in AWS KMS.
 */
export default class KmsKeyStore implements KeyStore {
  /** KeyStore properties. */
  public readonly publicKey: string
  public readonly publicKeyHash: string
  public readonly storeType: KeyStoreType
  public readonly derivationPath = undefined
  public readonly curve: KeyStoreCurve

  /** Do not access these members. Private Keys are stored in AWS KMS and are not accessible. */
  public readonly secretKey: string
  public readonly seed: string

  /**
   * Create a new `KeyStore` which wraps an AWS KMS key.
   *
   * @param kmsKeyId The Key ID in KMS.
   * @param region The AWS region the KMS Key resides in.
   */
  public static async from(
    kmsKeyId: string,
    region: string,
  ): Promise<KmsKeyStore> {
    const kmsClient = new TezosKmsClient(kmsKeyId, region)
    const publicKey = await kmsClient.getPublicKey()
    const publicKeyHash = await kmsClient.getPublicKeyHash()

    return new KmsKeyStore(publicKey, publicKeyHash)
  }

  /**
   * Create a new keystore.
   *
   * @param publicKey The public key.
   * @param publicKeyHash The public key hash.
   */
  private constructor(publicKey: string, publicKeyHash: string) {
    this.publicKey = publicKey
    this.publicKeyHash = publicKeyHash
    this.curve = KeyStoreCurve.SECP256K1
    this.storeType = KeyStoreType.Hardware

    // Stub out not available properties
    this.secretKey = 'NOT AVAILABLE'
    this.seed = 'NOT AVAILABLE'
  }
}
