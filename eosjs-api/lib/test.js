var request= require('sync-request');
var defaultoptions = { method: 'POST',
//url:url,
url: 'http://jungle.cryptolions.io:38888/v1/chain/get_block',
header: {
"content-type": "application/json"},
body: JSON.stringify({"block_num_or_id":1})
};
request('POST','http://jungle.cryptolions.io:38888/v1/chain/get_block',{
    headers: {
        "content-type": "application/json"},
    body: JSON.stringify({"block_num_or_id":1})


})