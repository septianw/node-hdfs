var masuk = {
  base: {
    pathname: 'webhdfs/v1'
  },
  path: {
    GET: {
      filestatus: {
        location: '%(path)s',
        query: {
          op: 'GETFILESTATUS'
        }
      },
      liststatus: {
        location: '%(path)s',
        query: {
          op: 'LISTSTATUS'
        }
      },
      openreadfile: {
        location: '%(path)s',
        query: {
          op: 'OPEN'
        }
      },
      gethomedir: {
        location: '%(path)s',
        query: {
          op: 'GETHOMEDIRECTORY'
        }
      },
      getcontentsum: {
        location: '%(path)s',
        query: {
          op: 'GETCONTENTSUMMARY'
        }
      },
      getfilechecksum: {
        location: '%(path)s',
        query: {
          op: 'GETFILECHECKSUM'
        }
      },
    },
    POST: {
      concat: {
        location: '%(path)s',
        query: {
          op: 'CONCAT'
        }
      },
      append: {
        location: '%(path)s',
        query: {
          op: 'APPEND'
        }
      },
    },
    PUT: {
      create: {
        location: '%(path)s',
        query: {
          op: 'CREATE'
        }
      },
      rename: {
        location: '%(path)s',
        query: {
          op: 'RENAME'
        }
      },
      makedir: {
        location: '%(path)s',
        query: {
          op: 'MKDIRS'
        }
      },
      setpermission: {
        location: '%(path)s',
        query: {
          op: 'SETPERMISSION',
          permission: 755
        }
      },
      setowner: {
        location: '%(path)s',
        query: {
          op: 'SETOWNER',
        }
      },
      setreplication: {
        location: '%(path)s',
        query: {
          op: 'SETREPLICATION',
        }
      },
      settimes: {
        location: '%(path)s',
        query: {
          op: 'SETTIMES',
        }
      },

    },
    DELETE: {
      delete: {
        location: '%(path)s',
        query: {
          op: 'DELETE'
        }
      },
    }
  }
};
console.log(JSON.stringify(masuk, null, 2));
