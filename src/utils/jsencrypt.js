import JSEncrypt from "jsencrypt";
const encryptor = new JSEncrypt();

// 密钥对生成 http://web.chacuo.net/netrsakeypair
const publicKey =
	"-----BEGIN PUBLIC KEY-----" +
	"MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDnlSmqB8uf/sDCRP4Xp86sdqmu" +
	"PUKq19eYALjRuQycsZ87v34MD0k10UKZ5H0AmEam24jdgWhq0wQtkAZZXeabT+dE" +
	"WZkOm8YzFsjpaSUl9k/9Sm2JBZR13voZbx+ANUUTe8ZLbpcHlM68on1DP/UviQv8" +
	"xKHCnkvB/3Mq5lkZdwIDAQAB-----END PUBLIC KEY-----";

const privateKey =
	"-----BEGIN PRIVATE KEY-----" +
	"MIICdwIBADANBgkqhkiG9w0BAQEFAASCAmEwggJdAgEAAoGBAOeVKaoHy5/+wMJE" +
	"/henzqx2qa49QqrX15gAuNG5DJyxnzu/fgwPSTXRQpnkfQCYRqbbiN2BaGrTBC2Q" +
	"Blld5ptP50RZmQ6bxjMWyOlpJSX2T/1KbYkFlHXe+hlvH4A1RRN7xktulweUzryi" +
	"fUM/9S+JC/zEocKeS8H/cyrmWRl3AgMBAAECgYBXSZPAsNuBXMZO8y5KwEdYHgnq" +
	"0NBWELEEbBE9i2BDl3eLT6w043YWwN83njW3ia3nqou14db3nL3QZp7eBFSssiar" +
	"BsRyfr8AaURkOKh/Zt4xVhO56WnKda3mvqIgpXd8PoScaYNCE5rtMlU8Z/Nxea1l" +
	"qovT7vl/6lCt78PQ8QJBAPf2ir09HnEr16VRdXBsg75kj6uMyTYFcMXCfitaqR/k" +
	"jQRYCs6pcJK4ODnJ8yG9dG8QDJAvssWzx5/E83BqKxsCQQDvFrSfFG/6VbfHjvvJ" +
	"AAReH7Mi60danqDzaETuUqmHlPJvDE6ydiTgQEDTYM/DhIKGlb1slGbUSc6ZoJNc" +
	"IXTVAkEAoiP+mLusekg23I0lg/wRMaBEKeMHd2GbWlVRdzvzNz2V0G9ZscUuLWJ0" +
	"saUSbM+boTwXWvk1pv1l3V1F6g4iXQJAI7RVVuhbbJv+bPvKWBL7k/7R5qYSKtND" +
	"n/XzTU/k5010AudonTgNe7u8spRjkoQoZebYue1TieJXyxNyzjBk3QJBAJ2i4q9p" +
	"Tlb/OQnqSGGZ9MDIPKmwMppJ1wmZeCOTZHyqsxYAjm7pXiTzzZb69/3YtMytiTUi" +
	"vsllgOEMvuNUYHY=" +
	"-----END PRIVATE KEY-----";

// 加密
export function encrypt(txt) {
	encryptor.setPublicKey(publicKey); // 设置公钥
	return encryptor.encrypt(txt); // 对数据进行加密
}

// 解密
export function decrypt(txt) {
	encryptor.setPrivateKey(privateKey); // 设置私钥
	return encryptor.decrypt(txt); // 对数据进行解密
}
