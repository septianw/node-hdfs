# NPM HDFS module

[![Build Status](http://192.168.1.245/api/badges/septian/hdfs/status.svg)](http://192.168.1.245/septian/hdfs)

This is node.js interface to communicating with web HDFS interface.

## How to use

### Installing
Before we can use this module we need to install it first

```bash
$ npm set registry http://192.168.1.245:4873
$ npm install --save hdfs
```

### Using
```node.js
var Hdfs = require('hdfs'),
  localpath = '/tmp/filetest.txt',
  remotepath = '/user/apps/filetest.txt';

var hdfs = new Hdfs({
  protocol: 'http',
  hostname: '192.168.1.225',
  port: 50070
});

hdfs.upload({
  'user.name': 'apps',
  overwrite: true,
  localpath: localpath,
  path: remotepath
}, function(error, response, body) {
  console.log(error);    // Error will be null if upload process is succeed.
  console.log(response); // Raw response from node.js request.
  console.log(body);     // Body of request result.
});
```


## Functions

<dl>
<dt><a href="#cekpath">cekpath(param)</a> ⇒ <code>Object</code></dt>
<dd><p>Check the parameter, return path if there is path in parameter,
and return / if no path in parameter.</p>
</dd>
<dt><a href="#prepvar">prepvar(param)</a> ⇒ <code>Object</code></dt>
<dd><p>Prepare parameter, separate request option and request parameter,
set default option, and explicitly set path.</p>
</dd>
<dt><a href="#Hdfs">Hdfs(data)</a></dt>
<dd><p>Hdfs class constructor</p>
</dd>
</dl>

<a name="cekpath"></a>

## cekpath(param) ⇒ <code>Object</code>
Check the parameter, return path if there is path in parameter,
and return / if no path in parameter.

**Kind**: global function  
**Returns**: <code>Object</code> - Object with only path in it.  

| Param | Type | Description |
| --- | --- | --- |
| param | <code>Object</code> | Parameter from user |

<a name="prepvar"></a>

## prepvar(param) ⇒ <code>Object</code>
Prepare parameter, separate request option and request parameter,
set default option, and explicitly set path.

**Kind**: global function  
**Returns**: <code>Object</code> - Clean ready to use request parameter.  

| Param | Type | Description |
| --- | --- | --- |
| param | <code>Object</code> | Mixed request parameter. |

<a name="Hdfs"></a>

## Hdfs(data)
Hdfs class constructor

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | Object data seed. |


* [Hdfs(data)](#Hdfs)
    * [.getfilestatus(param, callback)](#Hdfs+getfilestatus)
    * [.liststatus(param, callback)](#Hdfs+liststatus)
    * [.download(param, callback)](#Hdfs+download)
    * [.upload(param, callback)](#Hdfs+upload)
    * [.open(param, callback)](#Hdfs+open)
    * [.gethomedirectory(param, callback)](#Hdfs+gethomedirectory)
    * [.getcontentsummary(param, callback)](#Hdfs+getcontentsummary)
    * [.getfilechecksum(param, callback)](#Hdfs+getfilechecksum)
    * [.concat(param, callback)](#Hdfs+concat)
    * [.append(param, callback)](#Hdfs+append)
    * [.create(param, callback)](#Hdfs+create)
    * [.rename(param, callback)](#Hdfs+rename)
    * [.mkdirs(param, callback)](#Hdfs+mkdirs)
    * [.setpermission(param, callback)](#Hdfs+setpermission)
    * [.setowner(param, callback)](#Hdfs+setowner)
    * [.setreplication(param, callback)](#Hdfs+setreplication)
    * [.settimes(param, callback)](#Hdfs+settimes)
    * [.delete(param, callback)](#Hdfs+delete)

<a name="Hdfs+getfilestatus"></a>

### hdfs.getfilestatus(param, callback)
**Get file status from HDFS**
Possible properties of param is :

| name | presence | type | default | description |
| --- | --- | --- | --- | --- |
| path | optional | String | / | Path status that will be taken |

**Kind**: instance method of <code>[Hdfs](#Hdfs)</code>  

| Param | Type | Description |
| --- | --- | --- |
| param | <code>Object</code> | Request parameter for get file status endpoint |
| callback | <code>function</code> | Callback function to return the result |

<a name="Hdfs+liststatus"></a>

### hdfs.liststatus(param, callback)
List status of file and directory under specified directory

| name | presence | type | default | description |
| ---- | -------- | ---- | ------- | ----------- |
| path | optional | String | / | Path status that will be taken |

**Kind**: instance method of <code>[Hdfs](#Hdfs)</code>  

| Param | Type | Description |
| --- | --- | --- |
| param | <code>Object</code> | Request parameter for get list of status file |
| callback | <code>function</code> | Callback function to return the result |

<a name="Hdfs+download"></a>

### hdfs.download(param, callback)
Download file from HDFS with without buffering.

**Kind**: instance method of <code>[Hdfs](#Hdfs)</code>  
**See**: https://hadoop.apache.org/docs/r2.7.0/hadoop-project-dist/hadoop-hdfs/WebHDFS.html#Open_and_Read_a_File

Param properties :

|    name    | presence |  type  | default   |   valid value  | description |
| ---------- | -------- | ------ | --------- | -------------- | ----------- |
| path       | optional | String | /         | An absolute FileSystem path without scheme and authority. | Path status that will be taken |
| offset     | optional | Long   | 0         | >=0            | The starting byte position |
| length     | optional | Long   | null      | >=0 or null    | The number of bytes to be processed. null means the entire file |
| buffersize | optional | Int    | Specified in hadoop configuration | >0 | The size of the buffer used in transferring data. |  

| Param | Type | Description |
| --- | --- | --- |
| param | <code>Object</code> | Request parameter for download file from HDFS |
| callback | <code>function</code> | Callback function to return the result |

<a name="Hdfs+upload"></a>

### hdfs.upload(param, callback)
Upload file to HDFS without buffering.

**Kind**: instance method of <code>[Hdfs](#Hdfs)</code>  
**See**: https://hadoop.apache.org/docs/r2.7.0/hadoop-project-dist/hadoop-hdfs/WebHDFS.html#Create_and_Write_to_a_File

Param properties :

|    name     | presence |  type   | default | valid value | description |
| ----------- | -------- | ------- | ------- | --- | ----------- |
| path        | optional | String  | /       | An absolute FileSystem path without scheme and authority. | Path status that will be taken |
| overwrite   | optional | Boolean | false   | true or false | If a file already exists, should it be overwritten? |
| blocksize   | optional | Long    | Specified in hadoop configuration | >0 | The block size of a file. |
| replication | optional | Short   | Specified in hadoop configuration | >0 | The number of replications of a file. |
| permission  | optional | octal   | 755     | 0 - 1777 | The permission of a file/directory. |
| buffersize  | optional | Int     | Specified in hadoop configuration | >0 | The size of the buffer used in transferring data. |  

| Param | Type | Description |
| --- | --- | --- |
| param | <code>Object</code> | Request parameter for upload file from HDFS |
| callback | <code>function</code> | Callback function to return the result |

<a name="Hdfs+open"></a>

### hdfs.open(param, callback)
Open file from HDFS, this function will buffer content file in memory

**Kind**: instance method of <code>[Hdfs](#Hdfs)</code>  
**See**: https://hadoop.apache.org/docs/r2.7.0/hadoop-project-dist/hadoop-hdfs/WebHDFS.html#Open_and_Read_a_File

Param properties :

|    name     | presence |  type   | default |  valid value   | description |
| ----------- | -------- | ------- | ------- | -------------- | ----------- |
| path        | optional | String  | /       | An absolute FileSystem path without scheme and authority. | Path status that will be taken |
| offset      | optional | Long    | 0       | >=0            | The starting byte position |
| length      | optional | Long    | null    | >=0 or null    | The number of bytes to be processed. null means the entire file |
| buffersize  | optional | Int     | Specified in hadoop configuration | >0 | The size of the buffer used in transferring data. |  

| Param | Type | Description |
| --- | --- | --- |
| param | <code>Object</code> | Request parameter for open file from HDFS |
| callback | <code>function</code> | Callback function to return the result |

<a name="Hdfs+gethomedirectory"></a>

### hdfs.gethomedirectory(param, callback)
Get home directory of current accessing user.

**Kind**: instance method of <code>[Hdfs](#Hdfs)</code>  
**See**: https://hadoop.apache.org/docs/r2.7.0/hadoop-project-dist/hadoop-hdfs/WebHDFS.html#Get_Home_Directory  

| Param | Type | Description |
| --- | --- | --- |
| param | <code>Object</code> | Request parameter for getting home directory. |
| callback | <code>function</code> | Callback function to return the result |

<a name="Hdfs+getcontentsummary"></a>

### hdfs.getcontentsummary(param, callback)
Get summary of content

**Kind**: instance method of <code>[Hdfs](#Hdfs)</code>  
**See**: https://hadoop.apache.org/docs/r2.7.0/hadoop-project-dist/hadoop-hdfs/WebHDFS.html#Get_Content_Summary_of_a_Directory

|    name     | presence |  type   | default |  valid value   | description |
| ----------- | -------- | ------- | ------- | -------------- | ----------- |
| path        | optional | String  | /       | An absolute FileSystem path without scheme and authority. | Path status that will be taken |  

| Param | Type | Description |
| --- | --- | --- |
| param | <code>Object</code> | Request parameter for getting home directory. |
| callback | <code>function</code> | Callback function to return the result |

<a name="Hdfs+getfilechecksum"></a>

### hdfs.getfilechecksum(param, callback)
Get checksum of file

**Kind**: instance method of <code>[Hdfs](#Hdfs)</code>  
**See**: https://hadoop.apache.org/docs/r2.7.0/hadoop-project-dist/hadoop-hdfs/WebHDFS.html#Get_File_Checksum

|    name     | presence |  type   | default |  valid value   | description |
| ----------- | -------- | ------- | ------- | -------------- | ----------- |
| path        | optional | String  | /       | An absolute FileSystem path without scheme and authority. | Path status that will be taken |  

| Param | Type | Description |
| --- | --- | --- |
| param | <code>Object</code> | Request parameter for get checksum of file. |
| callback | <code>function</code> | Callback function to return the result |

<a name="Hdfs+concat"></a>

### hdfs.concat(param, callback)
Concatenating file to another one.
**Warning** : It's still experimental. We warn you.

**Kind**: instance method of <code>[Hdfs](#Hdfs)</code>  
**See**: https://hadoop.apache.org/docs/r2.7.0/hadoop-project-dist/hadoop-hdfs/WebHDFS.html#Concat_Files

|    name     | presence  |  type   | default |  valid value   | description |
| ----------- | --------  | ------- | ------- | -------------- | ----------- |
| path        | Mandatory | String  | /       | An absolute FileSystem path without scheme and authority. | Path status that will be taken |
| sources     | Mandatory | String  | <empty> | A list of comma seperated absolute FileSystem paths without scheme and authority. | A list of source paths. |  

| Param | Type | Description |
| --- | --- | --- |
| param | <code>Object</code> | Request parameter for concatenating file. |
| callback | <code>function</code> | Callback function to return the result |

<a name="Hdfs+append"></a>

### hdfs.append(param, callback)
Append data to another file in HDFS

**Kind**: instance method of <code>[Hdfs](#Hdfs)</code>  
**See**: https://hadoop.apache.org/docs/r2.7.0/hadoop-project-dist/hadoop-hdfs/WebHDFS.html#Append_to_a_File

Param properties :

|     name    | presence  |  type   | default | valid value | description |
| ----------- | --------- | ------- | ------- | ----------- | ----------- |
| path        | Mandatory | String  | /       | An absolute FileSystem path without scheme and authority. | Path status that will be taken |
| buffersize  | optional  | Int     | Specified in hadoop configuration | >0 | The size of the buffer used in transferring data. |  

| Param | Type | Description |
| --- | --- | --- |
| param | <code>Object</code> | Request parameter for upload file from HDFS |
| callback | <code>function</code> | Callback function to return the result |

<a name="Hdfs+create"></a>

### hdfs.create(param, callback)
Create file in HDFS.

**Kind**: instance method of <code>[Hdfs](#Hdfs)</code>  
**See**: https://hadoop.apache.org/docs/r2.7.0/hadoop-project-dist/hadoop-hdfs/WebHDFS.html#Create_and_Write_to_a_File

Param properties :

|     name    | presence  |  type   | default | valid value | description |
| ----------- | --------- | ------- | ------- | --- | ----------- |
| path        | Mandatory | String  | /       | An absolute FileSystem path without scheme and authority. | Path status that will be taken |
| overwrite   | optional  | Boolean | false   | true or false | If a file already exists, should it be overwritten? |
| blocksize   | optional  | Long    | Specified in hadoop configuration | >0 | The block size of a file. |
| replication | optional  | Short   | Specified in hadoop configuration | >0 | The number of replications of a file. |
| permission  | optional  | octal   | 755     | 0 - 1777 | The permission of a file/directory. |
| buffersize  | optional  | Int     | Specified in hadoop configuration | >0 | The size of the buffer used in transferring data. |  

| Param | Type | Description |
| --- | --- | --- |
| param | <code>Object</code> | Request parameter for upload file from HDFS |
| callback | <code>function</code> | Callback function to return the result |

<a name="Hdfs+rename"></a>

### hdfs.rename(param, callback)
Rename file or directory in HDFS

**Kind**: instance method of <code>[Hdfs](#Hdfs)</code>  
**See**: https://hadoop.apache.org/docs/r2.7.0/hadoop-project-dist/hadoop-hdfs/WebHDFS.html#Rename_a_FileDirectory

Param properties :

|     name    | presence  |  type   | default | valid value | description |
| ----------- | --------- | ------- | ------- | --- | ----------- |
| path        | Mandatory | String  | /       | An absolute FileSystem path without scheme and authority. | Path status that will be taken |
| destination | Mandatory | String  | <empty> (an invalid path) | An absolute FileSystem path without scheme and authority. | The destination path. |  

| Param | Type | Description |
| --- | --- | --- |
| param | <code>Object</code> | Request parameter for rename file or directory. |
| callback | <code>function</code> | Callback function to return the result |

<a name="Hdfs+mkdirs"></a>

### hdfs.mkdirs(param, callback)
Make directory in Hdfs

**Kind**: instance method of <code>[Hdfs](#Hdfs)</code>  
**See**: https://hadoop.apache.org/docs/r2.7.0/hadoop-project-dist/hadoop-hdfs/WebHDFS.html#Make_a_Directory

Param properties :

|    name     | presence |  type   | default | valid value | description |
| ----------- | -------- | ------- | ------- | --- | ----------- |
| path        | optional | String  | /       | An absolute FileSystem path without scheme and authority. | Path status that will be taken |
| permission  | optional | octal   | 755     | 0 - 1777 | The permission of a file/directory. |  

| Param | Type | Description |
| --- | --- | --- |
| param | <code>Object</code> | Request parameter for make directory in HDFS |
| callback | <code>function</code> | Callback function to return the result |

<a name="Hdfs+setpermission"></a>

### hdfs.setpermission(param, callback)
Set permission of file in HDFS

**Kind**: instance method of <code>[Hdfs](#Hdfs)</code>  
**See**: https://hadoop.apache.org/docs/r2.7.0/hadoop-project-dist/hadoop-hdfs/WebHDFS.html#Set_Permission

Param properties :

|    name     | presence  |  type   | default | valid value | description |
| ----------- | --------- | ------- | ------- | --- | ----------- |
| path        | Mandatory | String  | /       | An absolute FileSystem path without scheme and authority. | Path status that will be taken |
| permission  | Mandatory | octal   | 755     | 0 - 1777 | The permission of a file/directory. |  

| Param | Type | Description |
| --- | --- | --- |
| param | <code>Object</code> | Request parameter for set permission of file and directory in HDFS |
| callback | <code>function</code> | Callback function to return the result |

<a name="Hdfs+setowner"></a>

### hdfs.setowner(param, callback)
Set owner of file or directory

**Kind**: instance method of <code>[Hdfs](#Hdfs)</code>  
**See**: https://hadoop.apache.org/docs/r2.7.0/hadoop-project-dist/hadoop-hdfs/WebHDFS.html#Set_Owner

Param properties :

|    name     | presence  |  type   | default | valid value | description |
| ----------- | --------- | ------- | ------- | --- | ----------- |
| path        | Mandatory | String  | /       | An absolute FileSystem path without scheme and authority. | Path status that will be taken |
| owner       | Optional  | String  | <empty> (means keeping it unchanged) | Any valid username. | The username who is the owner of a file/directory. |
| group       | Optional  | String  | <empty> (means keeping it unchanged) | Any valid group name. | The name of a group. |  

| Param | Type | Description |
| --- | --- | --- |
| param | <code>Object</code> | Request parameter for set owner in HDFS |
| callback | <code>function</code> | Callback function to return the result |

<a name="Hdfs+setreplication"></a>

### hdfs.setreplication(param, callback)
Set replication factor of file.

**Kind**: instance method of <code>[Hdfs](#Hdfs)</code>  
**See**: https://hadoop.apache.org/docs/r2.7.0/hadoop-project-dist/hadoop-hdfs/WebHDFS.html#Set_Replication_Factor

Param properties :

|    name     | presence  |  type   | default | valid value | description |
| ----------- | --------- | ------- | ------- | --- | ----------- |
| path        | Mandatory | String  | /       | An absolute FileSystem path without scheme and authority. | Path status that will be taken |
| replication | Optional  | Short   | Specified in the configuration. | >0 | The number of replications of a file. |  

| Param | Type | Description |
| --- | --- | --- |
| param | <code>Object</code> | Request parameter for set replication file. |
| callback | <code>function</code> | Callback function to return the result |

<a name="Hdfs+settimes"></a>

### hdfs.settimes(param, callback)
Set time and date of file in HDFS

**Kind**: instance method of <code>[Hdfs](#Hdfs)</code>  
**See**: https://hadoop.apache.org/docs/r2.7.0/hadoop-project-dist/hadoop-hdfs/WebHDFS.html#Set_Access_or_Modification_Time

Param properties :

|    name     | presence  |  type   | default | valid value | description |
| ----------- | --------- | ------- | ------- | --- | ----------- |
| path        | Mandatory | String  | /       | An absolute FileSystem path without scheme and authority. | Path status that will be taken |
| modificationtime | Optional | Long | -1 (means keeping it unchanged) | -1 or a timestamp | The modification time of a file/directory. |
| accesstime | Optional | Long | -1 (means keeping it unchanged) | -1 or a timestamp | The access time of a file/directory. |  

| Param | Type | Description |
| --- | --- | --- |
| param | <code>Object</code> | Request parameter for setting time and date of file. |
| callback | <code>function</code> | Callback function to return the result |

<a name="Hdfs+delete"></a>

### hdfs.delete(param, callback)
Delete file or directory in HDFS

**Kind**: instance method of <code>[Hdfs](#Hdfs)</code>  
**See**: https://hadoop.apache.org/docs/r2.7.0/hadoop-project-dist/hadoop-hdfs/WebHDFS.html#Delete_a_FileDirectory

Param properties :

|    name     | presence  |  type   | default | valid value | description |
| ----------- | --------- | ------- | ------- | --- | ----------- |
| path        | Mandatory | String  | /       | An absolute FileSystem path without scheme and authority. | Path status that will be taken |
| recursive   | Optional  | Boolean | false   | true or false | Should the operation act on the content in the subdirectories? |  

| Param | Type | Description |
| --- | --- | --- |
| param | <code>Object</code> | Request parameter for deleting file and or directory. |
| callback | <code>function</code> | Callback function to return the result |
