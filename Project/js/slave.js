

// 1)

const str1 = '\'But I can assure you, Ginny,\' he added, \'that you couldn\'t do better than Vogel.\'' ;

const regexp1 = /'/gim ;

console.log(str1.replace(regexp1, '"' ));


// 2)

const str2 = '\'But I can assure you, Ginny,\' he added, \'that you couldn\'t do better than Vogel.\'' ;

const regexp2 = /^'|(\s)'|'(\s)|'$/gim ;

console.log(str2.replace(regexp2, '"' ));


