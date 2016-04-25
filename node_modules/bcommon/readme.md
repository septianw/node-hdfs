## Functions

<dl>
<dt><a href="#chmod">chmod(file, mode, message)</a></dt>
<dd><p>Fungsi chmod
Fungsi ini bertindak sebagai penyederhana fungsi fs.chmod</p>
</dd>
<dt><a href="#genrandkey">genrandkey(length)</a> ⇒ <code>string</code></dt>
<dd><p>Fungsi generate random string</p>
<p>Fungsi ini akan generate string acak, secara default
fungsi ini akan membuat string sepanjang 48 byte.</p>
</dd>
<dt><a href="#showStatus">showStatus(code, message)</a> ⇒ <code>object</code></dt>
<dd><p>showStatus</p>
<p>show status of transaction</p>
</dd>
<dt><a href="#isEmptyObject">isEmptyObject(obj)</a> ⇒ <code>Boolean</code></dt>
<dd><p>Fungsi ini akan menguji object, apakah object tersebut kosong atau tidak.</p>
</dd>
<dt><a href="#uniq">uniq(a)</a> ⇒ <code>Object</code></dt>
<dd><p>Find unique content of object</p>
</dd>
<dt><a href="#namespace">namespace(name, separator, container, val)</a> ⇒ <code>Object</code></dt>
<dd><p>Change string to namespace</p>
</dd>
<dt><a href="#isjson">isjson(obj)</a> ⇒ <code>Boolean</code></dt>
<dd><p>Function to check if input object is json or not</p>
</dd>
<dt><a href="#showLog">showLog(String, String)</a> ⇒</dt>
<dd><p>Show log to console depend on config level.</p>
</dd>
</dl>

<a name="chmod"></a>

## chmod(file, mode, message)
Fungsi chmod
Fungsi ini bertindak sebagai penyederhana fungsi fs.chmod

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| file | <code>string</code> | file yang akan dirubah modenya |
| mode | <code>octal</code> | mode perubahan |
| message | <code>string</code> | pesan yang akan tampil ketika berhasil |

<a name="genrandkey"></a>

## genrandkey(length) ⇒ <code>string</code>
Fungsi generate random string

Fungsi ini akan generate string acak, secara default
fungsi ini akan membuat string sepanjang 48 byte.

**Kind**: global function  
**Returns**: <code>string</code> - random string in specified length  

| Param | Type | Description |
| --- | --- | --- |
| length | <code>integer</code> | integer length of string in byte |

<a name="showStatus"></a>

## showStatus(code, message) ⇒ <code>object</code>
showStatus

show status of transaction

**Kind**: global function  
**Returns**: <code>object</code> - object  json object of status  

| Param | Type | Description |
| --- | --- | --- |
| code | <code>integer</code> | kode status |
| message | <code>string</code> | Pesan yang akan ditampilkan ke status |

<a name="isEmptyObject"></a>

## isEmptyObject(obj) ⇒ <code>Boolean</code>
Fungsi ini akan menguji object, apakah object tersebut kosong atau tidak.

**Kind**: global function  
**Returns**: <code>Boolean</code> - Nilai balik berupa boolean, true bila kosong, atau false bila tidak.  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>Object</code> | Object yang akan diuji |

<a name="uniq"></a>

## uniq(a) ⇒ <code>Object</code>
Find unique content of object

**Kind**: global function  
**Returns**: <code>Object</code> - Unique result object  

| Param | Type | Description |
| --- | --- | --- |
| a | <code>Object</code> | Asserted object |

<a name="namespace"></a>

## namespace(name, separator, container, val) ⇒ <code>Object</code>
Change string to namespace

**Kind**: global function  
**Returns**: <code>Object</code> - Nested object result  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | Separated string |
| separator | <code>String</code> | Separator of string |
| container | <code>Object</code> | Target object |
| val | <code>Mixed</code> | Content of target object |

<a name="isjson"></a>

## isjson(obj) ⇒ <code>Boolean</code>
Function to check if input object is json or not

**Kind**: global function  
**Returns**: <code>Boolean</code> - Return True if input is json, or False otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>string</code> | String object to check. |

<a name="showLog"></a>

## showLog(String, String) ⇒
Show log to console depend on config level.

**Kind**: global function  
**Returns**: String        String shown to console.  

| Param | Description |
| --- | --- |
| String | type Type of log, it can be info, error, or debug. |
| String | msg  Message that want to shown on console. |

