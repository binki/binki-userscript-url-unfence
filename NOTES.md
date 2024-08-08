# Proofpoint

## v2

An example of a v2 endpoint encoding a v3 endpoint which demonstrates, for example, how `_` is encoded:

`https://urldefense.proofpoint.com/v2/url?u=https-3A__urldefense.com_v3_-5F-5Fhttps-3A__pymolwiki.org_index.php_Cartoon-5Fcylindrical-5Fhelices-5F-5F-3B-21-21LQC6Cpwp-21t0DZuo6iuU97IvdkbbkBWfCY1lTDOSB4i892YtRIoO96P2OS6LISLpFkHLHmaxa6RQJg3Ga-2DC-5FshzE-5FHMp-2DulGxGrDXsIg-24&d=DwIFAw&c=euGZstcaTDllvimEN8b7jXrwqOf-v5A_CdpgnVfiiMM&r=cL0WvLW074DHXNhkYyxmeHhSv30WxTDLNOf7i2e1T40&m=mhnzHJZKvzJXyhtsLUafPAoQcMtPwTn9h7DMddvDh93b6L9kHuQ_F8mycHZefZ_-&s=WbW3Vq8CuKSUv7pDTynG4kABW0IRM7ZNq5IhLSPPZdM&e=` (from https://mail.cgl.ucsf.edu/mailman/archives/list/chimerax-users@cgl.ucsf.edu/thread/BQ6Y3XYAKEIPAX3F5LI64LRYRODW2ZNH/ )

input: `https://urldefense.proofpoint.com/v2/url?u=https-3A__example.org_folder_subfolder_file-2Dwith-2Ddashes&…`

output: `https://example.org/folder/subfolder/file-with-dashes`

## v3

See example from v2:

`https://urldefense.com/v3/__https://pymolwiki.org/index.php/Cartoon_cylindrical_helices__;!!LQC6Cpwp!t0DZuo6iuU97IvdkbbkBWfCY1lTDOSB4i892YtRIoO96P2OS6LISLpFkHLHmaxa6RQJg3Ga-C_shzE_HMp-ulGxGrDXsIg$`

input: `https://urldefense.com/v3/__«url»__;!!«something»!«something»$`

output: «url»

Seems to be no escaping, just literal fencing. I do not know the logic of things to know how to search for the `__;!!` sequence properly. So will just match on the end part and remove that.
