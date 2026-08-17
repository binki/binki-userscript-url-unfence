const assert = require('assert');
const {
  binkiUserscriptUrlUnfenceAsync,
} = require('../binki-userscript-url-unfence.js');

describe('binkiUserscriptUrlUnfenceAsync', () => {
  function test(description, fencedUri, unfencedUri) {
    it(`can unfence a ${description} URI`, async () => {
      assert.strictEqual(await binkiUserscriptUrlUnfenceAsync(fencedUri), unfencedUri);
    });
  }
  test('https://www.google.com/url?url=', 'https://www.google.com/url?url=https:%2f%2fthis.is%2fa%3furl%3d2%26blah%3d3%23asdf', 'https://this.is/a?url=2&blah=3#asdf');
  test('https://www.google.com/url?q=', 'https://www.google.com/url?q=https:%2f%2fthis.is%2fa%3furl%3d2%26blah%3d3%23asdf', 'https://this.is/a?url=2&blah=3#asdf');
  test('https://l.messenger.com/l.php', 'https://l.messenger.com/l.php?u=https:%2f%2fthis.is%2fa%3furl%3d2%26blah%3d3%23asdf', 'https://this.is/a?url=2&blah=3#asdf');
  for (let i = 0; i < 20; i++) {
    test(`https://nam${i}.safelinks.protection.outlook.com/`, `https://nam${i}.safelinks.protection.outlook.com/?url=https:%2f%2fthis.is%2fa%3furl%3d2%26blah%3d3%23asdf`, 'https://this.is/a?url=2&blah=3#asdf');
  }
  test('https://urldefense.proofpoint.com/v1', 'https://urldefense.proofpoint.com/v1/?url=https:%2f%2fthis.is%2fa%3furl%3d2%26blah%3d3%23asdf', 'https://this.is/a?url=2&blah=3#asdf');
  // Oh look, something which doesn’t just use encodeURIComponent()!
  test('https://urldefense.proofpoint.com/v2', 'https://urldefense.proofpoint.com/v2/?u=https:__this-5fplace.is_a-5fb-3furl-3d2-26blah-3d3-23asdf', 'https://this_place.is/a_b?url=2&blah=3#asdf');
  test('https://urldefense.proofpoint.com/v2', 'https://urldefense.proofpoint.com/v2/url?u=https-3A__example.org_folder_subfolder_file-2Dwith-2Ddashes&', 'https://example.org/folder/subfolder/file-with-dashes');
  test('https://urldefense.com/v3+https://urldefense.proofpoint.com/v2', 'https://urldefense.proofpoint.com/v2/url?u=https-3A__urldefense.com_v3_-5F-5Fhttps-3A__pymolwiki.org_index.php_Cartoon-5Fcylindrical-5Fhelices-5F-5F-3B-21-21LQC6Cpwp-21t0DZuo6iuU97IvdkbbkBWfCY1lTDOSB4i892YtRIoO96P2OS6LISLpFkHLHmaxa6RQJg3Ga-2DC-5FshzE-5FHMp-2DulGxGrDXsIg-24&d=DwIFAw&c=euGZstcaTDllvimEN8b7jXrwqOf-v5A_CdpgnVfiiMM&r=cL0WvLW074DHXNhkYyxmeHhSv30WxTDLNOf7i2e1T40&m=mhnzHJZKvzJXyhtsLUafPAoQcMtPwTn9h7DMddvDh93b6L9kHuQ_F8mycHZefZ_-&s=WbW3Vq8CuKSUv7pDTynG4kABW0IRM7ZNq5IhLSPPZdM&e=', 'https://pymolwiki.org/index.php/Cartoon_cylindrical_helices');
  // This format is not understood so this might be wrong.
  test('https://urldefense.com/v3', 'https://urldefense.com/v3/__https://a.b/c/d/e?f=g&h=i__;!!asdf!asdf$', 'https://a.b/c/d/e?f=g&h=i');
  test('https://icp.ids.api.iris.microsoft.com/api/v2/a/c', 'https://icp.ids.api.iris.microsoft.com/api/v2/a/c?url=https%3a%2f%2fwww.microsoft.com%2fmicrosoft-365&d=AIAADDRCTWUHQM3CAJPM5KNPKSLM2CVDFZ3AU3H5UUTSHXOENTSSQS6PUXQG4PHQABVKIKENCYQ2YONTFKNQ22NDTJQT4H2SDMF2EAPU7CZBMAX6HPL37QZ7K46S65N63V3TTTGZEM77NUKPEL2AKDNNK66KF3E7AH3EN75DFNJ4DQS7TPGUN4WNWQE4OAEPH4BGNLSDVA6P6CLGBCONT5ZQ2FEKNSIHUO46R6AGIPEWX5W5WMD3CDBQNPWNWHXYYROH4&i=AIAACVG52B6NZEXV7IY6X7I5UP3NLPV3A7EWHMDQRCALAOI2XC5IW6EMA7WP6COCMGWS667LQB277DX7R3NWYFLVLBFUS6TNIT7BYUEEIE65NP5VM5B55KBD2EXOSVORNW3SV2IKFUWPJEBRBAFZWN4N5Q4Y4LULUNPPJLXOUYYDZ4ZYEPZQV4UVCTCYONNT33HLAQB7CO2AVTMHEKAEL64RESTDLOFZADXLP3ELTO44Z4MCYCQ343LLY6SVJYPV73RRFWYGAMEXTG7MK7N77HVRAPWNAKXTEFWUDR4TUYY2GA76J6F4WQDQ4FJPSD2TVOD2UVYMI5ATDL5PZOL3TUCRT4IUBCKYEAKLFKCMQ7D5C33KYJIEEQIJKI5H6ZU6VSVV7H2FXZYKFEMAYGR43HTDTCDDDA7SJCDD64232JAAUZBEGKFVO4C6QV2VRBLS6EKLMZKVDQVNH7K5EQWZG6MQKLEIWWOHAK3FYHLHJOCQNQYK5OBYBWNKEUW6FAMKLLP6TDDJHAGDN2R52LTVXX63DCGCNP3POVK64VFGGFPRCH4SGHIO6GYZ&s=HBWEY7HNM7GI64P5XU6RTEQ7AEBISW27QJIEM3MRZDIQJNC2F3BA', 'https://www.microsoft.com/microsoft-365');
});
