const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../db');
const envars = require('../envars.json');
const router = express.Router();

router.get('/', (req, res) => {

    var atoken = req.cookies.authtoken;
    //read cookie and verify jwt token
    if (atoken) {
        jwt.verify(atoken, envars.jwtkey, (err, user) => {
            if (err) {
                var pagevars = {
                    title: 'Login to Dox'
                }
                res.render('login', { pagevars });
            } else {
                var pagevars = {
                    title: 'Dashboard',
                    user: user
                }
                res.render('dashboard', { pagevars });
            }
        });
    } else {
        var pagevars = {
            title: 'Login to Dox'
        }
        res.render('login', { pagevars });
    }
});

router.get('/boxes', (req, res) => {

    var atoken = req.cookies.authtoken;
    //read cookie and verify jwt token
    if (atoken) {
        jwt.verify(atoken, envars.jwtkey, (err, user) => {
            if (err) {
                var pagevars = {
                    title: 'Login to Dox'
                }
                res.render('login', { pagevars });
            } else {
                //Query for user created AND joined boxes with seldashboxes PROCEDURE
                db.query(`CALL seldashboxes('?');`, [user.userid], function (err, rows, fields) {
                    if (err) throw err;
                    var cboxes = rows[0], jboxes = rows[1];
                    //set pagevars
                    var pagevars = {
                        title: "My Dashboard",
                        user: user,
                        cboxes: cboxes,
                        jboxes: jboxes
                    }
                    res.render('boxes', { pagevars });
                });
            }
        });
    } else {
        var pagevars = {
            title: 'Login to Dox'
        }
        res.render('login', { pagevars });
    }
});

router.post('/boxes', (req, res) => {

    var atoken = req.cookies.authtoken;
    var boxname = req.body.boxname;
    var secret = req.body.secret;
    //read cookie and verify jwt token
    if (atoken) {
        jwt.verify(atoken, envars.jwtkey, (err, user) => {
            if (err) {
                var pagevars = {
                    title: 'Login to Dox'
                }
                res.render('login', { pagevars });
            } else {
                //Query for user created boxes
                db.query(`INSERT INTO doxboxes (creatorid, boxname, secret) VALUES (?, ?, ?);`, [user.userid, boxname, secret], (err, result, fields) => {
                    if (err) {
                        throw err;
                    } else {
                        res.redirect('/dashboard/boxes');
                    }
                });
            }
        });
    } else {
        var pagevars = {
            title: 'Login to Dox'
        }
        res.render('login', { pagevars });
    }
});

router.post('/boxes/join', (req, res) => {

    var atoken = req.cookies.authtoken;
    var boxname = req.body.boxname;
    var secret = req.body.secret;
    //read cookie and verify jwt token
    if (atoken) {
        jwt.verify(atoken, envars.jwtkey, (err, user) => {
            if (err) {
                var pagevars = {
                    title: 'Login to Dox'
                }
                res.render('login', { pagevars });
            } else {
            
                db.query(`SELECT * FROM doxboxes WHERE boxname = ?`, [boxname], (erro, rowso, fieldso) => {
                    if (erro) throw erro;
                    if (rowso.length == 1 && secret === rowso[0].secret) {
                        var box = rowso[0];
                        db.query(`INSERT INTO boxusers (userid, boxid) VALUES (?, ?);`, [user.userid, box.boxid], (err, rows, fields) => {
                            if (err) throw err;
                            res.redirect('/dashboard/boxes');
                        });
                    } else {
                        res.status(500).json({message: 'Join Unsuccessful', rowso});
                    }
                });
            }
        });
    } else {
        var pagevars = {
            title: 'Login to Dox'
        }
        res.render('login', { pagevars });
    }
});

router.get('/boxes/:boxid', (req, res) => {

    var boxid = req.params.boxid;

    var atoken = req.cookies.authtoken;
    //read cookie and verify jwt token
    if (atoken) {
        jwt.verify(atoken, envars.jwtkey, (err, user) => {
            if (err) {
                var pagevars = {
                    title: 'Login to Dox'
                }
                res.render('login', { pagevars });
            } else {
                //Query for owned box
                db.query(`CALL seladminbox(?);`, [boxid], (err, rows, fields) => {
                    if (err) throw err;
                    if (rows[0].length == 1) {
                        var boxes = rows[0]
                        var bgroups = rows[1];
                        var broles = rows[2];
                        var bmembers = rows[3];
                        var pagevars = {
                            title: 'My Dashboard',
                            user: user,
                            cbox: boxes[0],
                            bgroups: bgroups,
                            broles, broles,
                            bmembers: bmembers
                        }
                        res.render('boxadmin', { pagevars });
                    } else {
                        res.status(500).json({message: `No box found`});
                    }
                });
            }
        });
    } else {
        var pagevars = {
            title: 'Login to Dox'
        }
        res.render('login', { pagevars });
    }
});

router.post('/boxes/:boxid', (req, res) => {

    var boxid = req.params.boxid;

    var mtd = req.body._method;
    
    var atoken = req.cookies.authtoken;
    //read cookie and verify jwt token
    if (atoken) {
        jwt.verify(atoken, envars.jwtkey, (err, user) => {
            if (err) {
                var pagevars = {
                    title: 'Login to Dox'
                }
                res.render('login', { pagevars });
            } else {
                if (mtd == 'delete') {
                    db.query(`DELETE FROM doxboxes WHERE boxid = ?`, [boxid], (err, rows, fields) => {
                        if (err) throw err;
                        res.redirect('/dashboard/boxes');
                    });
                } else if (mtd == 'patch') {
                    var bname = req.body.nboxname, bsecret = req.body.nsecret;
                    db.query(`UPDATE doxboxes SET boxname = ?, secret = ? WHERE boxid = ?`, [bname, bsecret, boxid], (err, rows, fields) => {
                        if (err) throw err;
                        res.redirect('dashboard/boxes/' + boxid);
                    });
                }
            }
        });
    } else {
        var pagevars = {
            title: 'Login to Dox'
        }
        res.render('login', { pagevars });
    }
});

router.get('/boxes/:boxid/groups/:groupid/documents', (req, res) => {

    var boxid = req.params.boxid;
    var groupid = req.params.groupid;

    var atoken = req.cookies.authtoken;
    //read cookie and verify jwt token
    if (atoken) {
        jwt.verify(atoken, envars.jwtkey, (err, user) => {
            if (err) {
                var pagevars = {
                    title: 'Login to Dox'
                }
                res.render('login', { pagevars });
            } else {
                db.query(`SELECT doxboxes.*, boxgroups.* FROM doxboxes 
                          INNER JOIN boxgroups ON boxgroups.boxid = doxboxes.boxid AND boxgroups.groupid = ? 
                          WHERE doxboxes.boxid = ?`, [groupid, boxid], (erro, rowso, fieldso) => {
                    if (erro) throw erro;
                    if (rowso[0].creatorid == user.userid) {
                        //ADMIN QUERY FOR DOCS
                        db.query(`SELECT * FROM documents WHERE groupid = ?`, [groupid], (err, rows, fields) => {
                            if (err) throw err;
                            var pagevars = {
                                title: 'My Dashboard',
                                user: user,
                                boxid: boxid,
                                gid: groupid,
                                gname: rowso[0].groupname,
                                docs: rows,
                                perm: {r: true, w: true}
                            }
                            res.render('docs', { pagevars });
                        });
                    } else {
                        //MEMBER QUERY FOR DOCS
                        db.query(`CALL get_perm_and_docs(?, ?, ?)`, [boxid, user.userid, groupid], (err, rows, fields) => {
                            if (err) throw err;
                            var uroles = rows[0];
                            var permissions = uroles[0].permissions;
                            var pagevars = {
                                title: 'My Dashboard',
                                user: user,
                                boxid: boxid,
                                gid: groupid,
                                gname: rowso[0].groupname,
                                docs: rows[1],
                                perm: {r: permissions.match('Read'), w: permissions.match('Write')}
                            }
                            res.render('docs', { pagevars });
                        });
                    }
                });     
            }
        });
    } else {
        var pagevars = {
            title: 'Login to Dox'
        }
        res.render('login', { pagevars });
    }
});

router.post('/boxes/:boxid/groups/:groupid/documents', (req, res) => {

    var boxid = req.params.boxid;
    var groupid = req.params.groupid;
    var docname = req.body.docname;

    var atoken = req.cookies.authtoken;
    //read cookie and verify jwt token
    if (atoken) {
        jwt.verify(atoken, envars.jwtkey, (err, user) => {
            if (err) {
                var pagevars = {
                    title: 'Login to Dox'
                }
                res.render('login', { pagevars });
            } else {
                //Query for docs
                db.query(`INSERT INTO documents (docname, groupid) VALUES (?, ?)`, [docname, groupid], (err, rows, fields) => {
                    if (err) throw err;
                    res.redirect('/dashboard/boxes/' + boxid + '/groups/' + groupid + '/documents');
                });
            }
        });
    } else {
        var pagevars = {
            title: 'Login to Dox'
        }
        res.render('login', { pagevars });
    }
});

router.get('/boxes/:boxid/groups/:groupid/documents/:docid', (req, res) => {

    //View/Edit Document

    var boxid = req.params.boxid;
    var groupid = req.params.groupid;
    var docid = req.params.docid;

    var atoken = req.cookies.authtoken;
    //read cookie and verify jwt token
    if (atoken) {
        jwt.verify(atoken, envars.jwtkey, (err, user) => {
            if (err) {
                var pagevars = {
                    title: 'Login to Dox'
                }
                res.render('login', { pagevars });
            } else {
                db.query(`SELECT * FROM doxboxes WHERE boxid = ?`, [boxid], (err, rows, fields) => {
                    if (err) throw err;
                    if (rows[0].creatorid == user.userid) {
                        //ADMIN QUERY FOR DOC
                        db.query(`SELECT * FROM documents WHERE docid = ?`, [docid], (err, rows, fields) => {
                            if (err) throw err;
                            var pagevars = {
                                title: 'My Dashboard',
                                user: user,
                                boxid: boxid,
                                gid: groupid,
                                doc: rows[0],
                                perm: {r: true, w: true}
                            }
                            res.render('doc', { pagevars });
                        });
                    } else {
                        //MEMBER QUERY FOR DOC
                        //Query for permissions
                        db.query(`SELECT boxroles.permissions FROM boxusers 
                                  INNER JOIN boxroles ON boxusers.rolename = boxroles.rolename AND boxusers.boxid = boxroles.boxid
                                  WHERE boxusers.userid = ?`, [user.userid], (err, rows, fields) => {
                            var permissions = rows[0].permissions;
                            //Query for doc
                            db.query(`SELECT * FROM documents WHERE docid = ?`, [docid], (err, rows, fields) => {
                                if (err) throw err;
                                var pagevars = {
                                    title: 'My Dashboard',
                                    user: user,
                                    boxid: boxid,
                                    gid: groupid,
                                    doc: rows[0],
                                    perm: {r: permissions.match('Read'), w: permissions.match('Write')}
                                }
                                res.render('doc', { pagevars });
                            });
                        });
                    }
                });
            }
        });
    } else {
        var pagevars = {
            title: 'Login to Dox'
        }
        res.render('login', { pagevars });
    }
});

router.post('/boxes/:boxid/groups/:groupid/documents/:docid', (req, res) => {

    var boxid = req.params.boxid;
    var groupid = req.params.groupid;
    var docid = req.params.docid;
    var mtd = req.body._method;

    var atoken = req.cookies.authtoken;

    //read cookie and verify jwt token
    if (atoken) {
        jwt.verify(atoken, envars.jwtkey, (err, user) => {
            if (err) {
                var pagevars = {
                    title: 'Login to Dox'
                }
                res.render('login', { pagevars });
            } else {
                if (mtd == 'delete') {
                    //Member DELETE Document
                    db.query(`DELETE FROM documents WHERE docid = ?`, [docid], (err, rows, fields) => {
                        if (err) throw err;
                        res.redirect('/dashboard/boxes/' + boxid + '/groups/' + groupid + '/documents');
                    });
                } else if (mtd == 'patch') {
                    //Member Edit Document
                    var ncontent = req.body.dcontent;
                    //UPDATE Document
                    db.query(`UPDATE documents SET content = ? WHERE docid = ?;`, [ncontent, docid], (err, rows, fields) => {
                        if (err) throw err;
                        res.redirect('/dashboard/boxes/' + boxid + '/groups/' + groupid + '/documents/' + docid);
                    });
        
                }
            }
        });
    } else {
        var pagevars = {
            title: 'Login to Dox'
        }
        res.render('login', { pagevars });
    }
});

router.post('/boxes/:boxid/roles', (req, res) => {

    var boxid = req.params.boxid;
    var rolename = req.body.rolename;
    var permissions = req.body.permissions;
    var linkedgroup = req.body.linkedgroup;
    var mtd = req.body._method;

    var atoken = req.cookies.authtoken;
    //read cookie and verify jwt token
    if (atoken) {
        jwt.verify(atoken, envars.jwtkey, (err, user) => {
            if (err) {
                var pagevars = {
                    title: 'Login to Dox'
                }
                res.render('login', { pagevars });
            } else {
                //Query for owned box
                db.query(`INSERT INTO boxroles (boxid, rolename, permissions, groupname) VALUES (?, ?, ?, ?);`, [boxid, rolename, permissions, linkedgroup], (err, rows, fields) => {
                    if (err) throw err;
                    res.redirect('/dashboard/boxes/' + boxid);
                });
            }
        });
    } else {
        var pagevars = {
            title: 'Login to Dox'
        }
        res.render('login', { pagevars });
    }
});

router.post('/boxes/:boxid/roles/:roleid', (req, res) => {

    var boxid = req.params.boxid;
    var roleid = req.params.roleid;
    var rname = req.body.newrolename;
    var permissions = req.body.newpermissions;
    var linkedgroup = req.body.newlinkedgroup;
    var mtd = req.body._method;

    var atoken = req.cookies.authtoken;
    //read cookie and verify jwt token
    if (atoken) {
        jwt.verify(atoken, envars.jwtkey, (err, user) => {
            if (err) {
                var pagevars = {
                    title: 'Login to Dox'
                }
                res.render('login', { pagevars });
            } else {
                if (mtd == 'delete') {
                    //DELETE ROLE
                db.query(`DELETE FROM boxroles WHERE roleid = ?`, [roleid], (err, rows, fields) => {
                    if (err) throw err;
                    res.redirect('/dashboard/boxes/' + boxid);
                });
                } else if (mtd == 'patch') {
                    //UPDATE ROLE
                    db.query(`UPDATE boxroles SET rolename = ?, groupname = ?, permissions = ? WHERE roleid = ?`, [rname, linkedgroup, permissions, roleid], (err, rows, fields) => {
                        if (err) throw err;
                        res.redirect('/dashboard/boxes/' + boxid);
                    });
                }
            }
        });
    } else {
        var pagevars = {
            title: 'Login to Dox'
        }
        res.render('login', { pagevars });
    }
});

router.post('/boxes/:boxid/groups', (req, res) => {

    var boxid = req.params.boxid;
    var groupname = req.body.groupname;
    var atoken = req.cookies.authtoken;
    //read cookie and verify jwt token
    if (atoken) {
        jwt.verify(atoken, envars.jwtkey, (err, user) => {
            if (err) {
                var pagevars = {
                    title: 'Login to Dox'
                }
                res.render('login', { pagevars });
            } else {
                //Query for owned box
                db.query(`INSERT INTO boxgroups (boxid, groupname) VALUES (?, ?);`, [boxid, groupname], (err, rows, fields) => {
                    if (err) throw err;
                    res.redirect('/dashboard/boxes/' + boxid);
                });
            }
        });
    } else {
        var pagevars = {
            title: 'Login to Dox'
        }
        res.render('login', { pagevars });
    }
});

router.post('/boxes/:boxid/groups/:groupid', (req, res) => {

    var boxid = req.params.boxid;
    var groupid = req.params.groupid;
    var atoken = req.cookies.authtoken;
    //read cookie and verify jwt token
    if (atoken) {
        jwt.verify(atoken, envars.jwtkey, (err, user) => {
            if (err) {
                var pagevars = {
                    title: 'Login to Dox'
                }
                res.render('login', { pagevars });
            } else {
                if (req.body._method == 'patch') {
                    var newgroupname = req.body.newgroupname;
                    //patch groupname
                    db.query(`UPDATE boxgroups SET groupname = ? WHERE groupid = ? AND boxid = ?`, [newgroupname, groupid, boxid], (err, rows, fields) => {
                        if (err) throw err;
                        res.redirect('/dashboard/boxes/' + boxid);
                    });
                } else if (req.body._method == 'delete') {
                    //delete group
                    db.query(`DELETE FROM boxgroups WHERE groupid = ? AND boxid = ?`, [groupid, boxid], (err, rows, fields) => {
                        if (err) throw err;
                        res.redirect('/dashboard/boxes/' + boxid);
                    });
                }
            }
        });
    } else {
        var pagevars = {
            title: 'Login to Dox'
        }
        res.render('login', { pagevars });
    }
});

router.post('/boxes/:boxid/members', (req, res) => {

    var boxid = req.params.boxid;
    var membername = req.body.membername;
    var newrolename = req.body.newrolename;
    var atoken = req.cookies.authtoken;
    //read cookie and verify jwt token
    if (atoken) {
        jwt.verify(atoken, envars.jwtkey, (err, user) => {
            if (err) {
                var pagevars = {
                    title: 'Login to Dox'
                }
                res.render('login', { pagevars });
            } else {
                //Query for owned box
                db.query(`UPDATE boxusers INNER JOIN users ON boxusers.userid = users.userid SET rolename = ? WHERE users.username = ?;`, [newrolename, membername], (err, rows, fields) => {
                    if (err) throw err;
                    res.redirect('/dashboard/boxes/' + boxid);
                });
            }
        });
    } else {
        var pagevars = {
            title: 'Login to Dox'
        }
        res.render('login', { pagevars });
    }
});

router.post('/boxes/:boxid/members/:memid', (req, res) => {

    var boxid = req.params.boxid;
    var memid = req.params.memid;
    
    var mtd = req.body._method;
    
    var atoken = req.cookies.authtoken;
    //read cookie and verify jwt token
    if (atoken) {
        jwt.verify(atoken, envars.jwtkey, (err, user) => {
            if (err) {
                var pagevars = {
                    title: 'Login to Dox'
                }
                res.render('login', { pagevars });
            } else {
                if (mtd == 'delete') {
                    //DELETE BOXUSER
                    db.query(`DELETE FROM boxusers WHERE userid = ? AND boxid = ?`, [memid, boxid], (err, rows, fields) => {
                        if (err) throw err;
                        res.redirect('/dashboard/boxes/' + boxid);
                    });
                } else if (mtd == 'patch') {
                    var newrolename = req.body.newrole;
                    //UPDATE BOXUSER
                    db.query(`UPDATE boxusers SET rolename = ? WHERE userid = ? AND boxid = ?`, [newrolename, memid, boxid], (err, rows, fields) => {
                        if (err) throw err;
                        res.redirect('/dashboard/boxes/' + boxid);
                    });
                }
            }
        });
    } else {
        var pagevars = {
            title: 'Login to Dox'
        }
        res.render('login', { pagevars });
    }
});

function ckRouteAccess(user, rt) {

    if (rt.match('documents')) {
        //validate docid belongs to groupid, groupid belongs to boxid, and user has permissions on the group
    } else if (rt.match('groups')) {
        //validate groupid belongs to boxid and user has permissions on the group
    } else if (rt.match('boxes')) {
        //validate user is admin of box
    }

}

module.exports = router;