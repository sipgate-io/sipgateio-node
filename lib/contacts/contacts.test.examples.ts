export const example =
	'BEGIN:VCARD\r\n' +
	'VERSION:4.0\r\n' +
	'N:Doe;John;Mr.;\r\n' +
	'FN:John Doe\r\n' +
	'ORG:Example.com Inc.\r\n' +
	'TITLE:Imaginary test person\r\n' +
	'EMAIL;type=INTERNET;type=WORK;type=pref:johnDoe@example.org\r\n' +
	'TEL;type=HOME:+1 202 555 1212\r\n' +
	'item1.ADR;type=WORK:;;2 Enterprise Avenue;Worktown;NY;01111;USA\r\n' +
	'item1.X-ABADR:us\r\n' +
	'NOTE:John Doe has a long and varied history\\, being documented on more police files that anyone else. Reports of his death are alas numerous.\r\n' +
	'item3.URL;type=pref:http\\://www.example/com/doe\r\n' +
	'item3.X-ABLabel:_$!<HomePage>!$_\r\n' +
	'item4.URL:http\\://www.example.com/Joe/foaf.df\r\n' +
	'item4.X-ABLabel:FOAF\r\n' +
	'item5.X-ABRELATEDNAMES;type=pref:Jane Doe\r\n' +
	'item5.X-ABLabel:_$!<Friend>!$_\r\n' +
	'CATEGORIES:Work,Test group\r\n' +
	'X-ABUID:5AD380FD-B2DE-4261-BA99-DE1D1DB52FBE\\:ABPerson\r\n' +
	'END:VCARD\r\n';

export const exampleWithTwoAdresses =
	'BEGIN:VCARD\r\n' +
	'VERSION:4.0\r\n' +
	'N:Doe;John;Mr.;\r\n' +
	'FN:John Doe\r\n' +
	'ORG:Example.com Inc.\r\n' +
	'TITLE:Imaginary test person\r\n' +
	'EMAIL;type=INTERNET;type=WORK;type=pref:johnDoe@example.org\r\n' +
	'TEL;type=HOME:+1 202 555 1212\r\n' +
	'item1.ADR;type=WORK:;;2 Enterprise Avenue;Worktown;NY;01111;USA\r\n' +
	'item1.X-ABADR:us\r\n' +
	'item2.ADR;type=HOME;type=pref:;;3 Acacia Avenue;Hoemtown;MA;02222;USA\r\n' +
	'item2.X-ABADR:us\r\n' +
	'NOTE:John Doe has a long and varied history\\, being documented on more police files that anyone else. Reports of his death are alas numerous.\r\n' +
	'item3.URL;type=pref:http\\://www.example/com/doe\r\n' +
	'item3.X-ABLabel:_$!<HomePage>!$_\r\n' +
	'item4.URL:http\\://www.example.com/Joe/foaf.df\r\n' +
	'item4.X-ABLabel:FOAF\r\n' +
	'item5.X-ABRELATEDNAMES;type=pref:Jane Doe\r\n' +
	'item5.X-ABLabel:_$!<Friend>!$_\r\n' +
	'CATEGORIES:Work,Test group\r\n' +
	'X-ABUID:5AD380FD-B2DE-4261-BA99-DE1D1DB52FBE\\:ABPerson\r\n' +
	'END:VCARD\r\n';

export const exampleWithAllValues =
	'BEGIN:VCARD\r\n' +
	'VERSION:4.0\r\n' +
	'FN:Vorname Nachname\r\n' +
	'N:Nachname;Vorname\r\n' +
	'TITLE:Titel\r\n' +
	'GENDER:U;\r\n' +
	'BDAY:2000-02-13\r\n' +
	'ORG:Firma\r\n' +
	'TITLE:Rolle\r\n' +
	'ADR;TYPE=HOME:Postfach;Adresszusatz;Straße;ORT;Region;PLZ;Germany\r\n' +
	'TEL;TYPE=HOME:+4915199999999\r\n' +
	'EMAIL;TYPE=HOME,INTERNET:email@example.com\r\n' +
	'END:VCARD';

export const exampleWithTwoOrganizations =
	'BEGIN:VCARD\r\n' +
	'VERSION:4.0\r\n' +
	'FN:Vorname Nachname\r\n' +
	'N:Nachname;Vorname\r\n' +
	'TITLE:Titel\r\n' +
	'GENDER:U;\r\n' +
	'BDAY:2000-02-13\r\n' +
	'ORG:Firma\r\n' +
	'ORG:Firma 2\r\n' +
	'TITLE:Rolle\r\n' +
	'ADR;TYPE=HOME:Postfach;Adresszusatz;Straße;ORT;Region;PLZ;Germany\r\n' +
	'TEL;TYPE=HOME:+4915199999999\r\n' +
	'EMAIL;TYPE=HOME,INTERNET:email@example.com\r\n' +
	'END:VCARD';

export const exampleWithoutEmail =
	'BEGIN:VCARD\r\n' +
	'VERSION:4.0\r\n' +
	'N:Doe;John;Mr.;\r\n' +
	'FN:John Doe\r\n' +
	'ORG:Example.com Inc.\r\n' +
	'TITLE:Imaginary test person\r\n' +
	'TEL;type=HOME:+1 202 555 1212\r\n' +
	'item1.ADR;type=WORK:;;2 Enterprise Avenue;Worktown;NY;01111;USA\r\n' +
	'item1.X-ABADR:us\r\n' +
	'NOTE:John Doe has a long and varied history\\, being documented on more police files that anyone else. Reports of his death are alas numerous.\r\n' +
	'item3.URL;type=pref:http\\://www.example/com/doe\r\n' +
	'item3.X-ABLabel:_$!<HomePage>!$_\r\n' +
	'item4.URL:http\\://www.example.com/Joe/foaf.df\r\n' +
	'item4.X-ABLabel:FOAF\r\n' +
	'item5.X-ABRELATEDNAMES;type=pref:Jane Doe\r\n' +
	'item5.X-ABLabel:_$!<Friend>!$_\r\n' +
	'CATEGORIES:Work,Test group\r\n' +
	'X-ABUID:5AD380FD-B2DE-4261-BA99-DE1D1DB52FBE\\:ABPerson\r\n' +
	'END:VCARD\r\n';
