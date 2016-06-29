# API client
[![Build Status](https://travis-ci.org/septianw/node-apiclient.svg?branch=master)](https://travis-ci.org/septianw/node-apiclient)


API client adalah request wrapper

Basically, ApiClient is just a [request](https://www.npmjs.com/package/request) wrapper.
It wrap all request to more structured way. The way we separate remote endpoint
specification from coding overhead.

Because of apiclient is just wrapping [request](https://www.npmjs.com/package/request),
any of [request options](https://www.npmjs.com/package/request#requestoptions-callback)
can be used here.

## Usage

To access these URLs, we use apiclient this way :

URLs:
- GET https://remote.apihost.com:443/v1/api/user/1?apikey=asdf2345kjhnkj
- POST https://remote.apihost.com:443/v1/api/user?apikey=asdf2345kjhnkj
- PUT https://remote.apihost.com:443/v1/api/user/1?apikey=asdf2345kjhnkj
- DELETE https://remote.apihost.com:443/v1/api/user/1?apikey=asdf2345kjhnkj

```Javascript
var Apiclient = require('apiclient');
var seed = {
  base: {
    protocol: 'https',
    hostname: 'remote.apihost.com',
    port: 443,
    pathname: 'v1/api'
  },
  path: {
    GET: {
      user: {
        location: 'user/%(userid)d',
        query: {
          apikey: 'asdf2345kjhnkj'
        }
      }
    },
    POST: {
      user: {
        location: 'user',
        query: {
          apikey: 'asdf2345kjhnkj'
        }
      }
    },
    PUT: {
      user: {
        location: 'user/%(userid)d',
        query: {
          apikey: 'asdf2345kjhnkj'
        }
      }
    },
    DELETE: {
      user: {
        location: 'user/%(userid)d',
        query: {
          apikey: 'asdf2345kjhnkj'
        }
      }
    }
  }
}

var Api = new Apiclient(seed);

Api.get('user', {userid: 1}, {}, function (error, response, body) {
  console.log(error, response, body);
});

Api.post('user', {}, {
  body: {
    username: 'John',
    password: 'John123'
  }
}, function (error, response, body) {
  console.log(error, response, body);
});

Api.put('user', {userid: 1}, {}, function (error, response, body) {
  console.log(error, response, body);
});

Api.delete('user', {userid: 1}, {}, function (error, response, body) {
  console.log(error, response, body);
});
```

## Functions

<dl>
<dt><a href="#ApiClient">ApiClient(data)</a></dt>
<dd><p>ApiClient constructor</p>
</dd>
<dt><a href="#isEmptyObject">isEmptyObject(obj)</a> ⇒ <code>Boolean</code></dt>
<dd><p>Check if is object empty</p>
</dd>
</dl>

<a name="ApiClient"></a>

## ApiClient(data)
ApiClient constructor

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | Seed data. |


* [ApiClient(data)](#ApiClient)
    * [.download(api, param, options, callback)](#ApiClient+download) ⇒ <code>Void</code>
    * [.get(api, param, options, callback)](#ApiClient+get) ⇒ <code>Void</code>
    * [.postUpload(api, param, options, callback)](#ApiClient+postUpload) ⇒ <code>Void</code>
    * [.postForm(api, param, options, callback)](#ApiClient+postForm) ⇒ <code>Void</code>
    * [.post(api, param, options, callback)](#ApiClient+post) ⇒ <code>Void</code>
    * [.putForm(api, param, options, callback)](#ApiClient+putForm) ⇒ <code>Void</code>
    * [.put(api, param, options, callback)](#ApiClient+put) ⇒ <code>Void</code>
    * [.delete(api, param, options, callback)](#ApiClient+delete) ⇒ <code>Void</code>

<a name="ApiClient+download"></a>

### apiClient.download(api, param, options, callback) ⇒ <code>Void</code>
Download file from server

**Kind**: instance method of <code>[ApiClient](#ApiClient)</code>  
**Returns**: <code>Void</code> - Nothing to return.  

| Param | Type | Description |
| --- | --- | --- |
| api | <code>String</code> | Endpoint API. |
| param | <code>Object</code> | Parameter url object. |
| options | <code>Object</code> | Request option object. |
| callback | <code>function</code> | Callback function. |

<a name="ApiClient+get"></a>

### apiClient.get(api, param, options, callback) ⇒ <code>Void</code>
Get thing from server using method HTTP GET

**Kind**: instance method of <code>[ApiClient](#ApiClient)</code>  
**Returns**: <code>Void</code> - Nothing to return.  

| Param | Type | Description |
| --- | --- | --- |
| api | <code>String</code> | Endpoint API. |
| param | <code>Object</code> | Parameter url object. |
| options | <code>Object</code> | Request option object. |
| callback | <code>function</code> | Callback function. |

<a name="ApiClient+postUpload"></a>

### apiClient.postUpload(api, param, options, callback) ⇒ <code>Void</code>
Upload file to server using POST method with attached file on body.

**Kind**: instance method of <code>[ApiClient](#ApiClient)</code>  
**Returns**: <code>Void</code> - Nothing to return.  

| Param | Type | Description |
| --- | --- | --- |
| api | <code>String</code> | Endpoint API. |
| param | <code>Object</code> | Parameter url object. |
| options | <code>Object</code> | Request option object. |
| callback | <code>function</code> | Callback function. |

<a name="ApiClient+postForm"></a>

### apiClient.postForm(api, param, options, callback) ⇒ <code>Void</code>
Upload file to server using POST method with attached file on body,
formatted as multipart form.

**Kind**: instance method of <code>[ApiClient](#ApiClient)</code>  
**Returns**: <code>Void</code> - Nothing to return.  

| Param | Type | Description |
| --- | --- | --- |
| api | <code>String</code> | Endpoint API. |
| param | <code>Object</code> | Parameter url object. |
| options | <code>Object</code> | Request option object. |
| callback | <code>function</code> | Callback function. |

<a name="ApiClient+post"></a>

### apiClient.post(api, param, options, callback) ⇒ <code>Void</code>
Send string via POST method. This API will keep body on memory, attaching
big string more than 1MB is not recommended, as it will fill the memory so fast.

**Kind**: instance method of <code>[ApiClient](#ApiClient)</code>  
**Returns**: <code>Void</code> - Nothing to return.  

| Param | Type | Description |
| --- | --- | --- |
| api | <code>String</code> | Endpoint API. |
| param | <code>Object</code> | Parameter url object. |
| options | <code>Object</code> | Request option object. |
| callback | <code>function</code> | Callback function. |

<a name="ApiClient+putForm"></a>

### apiClient.putForm(api, param, options, callback) ⇒ <code>Void</code>
Send data using PUT method with multipart/form-data format body.

**Kind**: instance method of <code>[ApiClient](#ApiClient)</code>  
**Returns**: <code>Void</code> - Nothing to return.  

| Param | Type | Description |
| --- | --- | --- |
| api | <code>String</code> | Endpoint API. |
| param | <code>Object</code> | Parameter url object. |
| options | <code>Object</code> | Request option object. |
| callback | <code>function</code> | Callback function. |

<a name="ApiClient+put"></a>

### apiClient.put(api, param, options, callback) ⇒ <code>Void</code>
Send data using PUT method with raw string body.

**Kind**: instance method of <code>[ApiClient](#ApiClient)</code>  
**Returns**: <code>Void</code> - Nothing to return.  

| Param | Type | Description |
| --- | --- | --- |
| api | <code>String</code> | Endpoint API. |
| param | <code>Object</code> | Parameter url object. |
| options | <code>Object</code> | Request option object. |
| callback | <code>function</code> | Callback function. |

<a name="ApiClient+delete"></a>

### apiClient.delete(api, param, options, callback) ⇒ <code>Void</code>
Send data using DELETE method with raw string body.

**Kind**: instance method of <code>[ApiClient](#ApiClient)</code>  
**Returns**: <code>Void</code> - Nothing to return.  

| Param | Type | Description |
| --- | --- | --- |
| api | <code>String</code> | Endpoint API. |
| param | <code>Object</code> | Parameter url object. |
| options | <code>Object</code> | Request option object. |
| callback | <code>function</code> | Callback function. |

<a name="isEmptyObject"></a>

## isEmptyObject(obj) ⇒ <code>Boolean</code>
Check if is object empty

**Kind**: global function  
**Returns**: <code>Boolean</code> - Return true if empty or false otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>Object</code> | Object to be Check |
