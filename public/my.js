$(document).ready(() => {

    var cboxbutton = $('#createbutton');
    var jboxbutton = $('#joinbutton');
    var crolebutton = $('#crolebutton');
    var cgroupbutton = $('#cgroupbutton');
    var euserbutton = $('#euserbutton');
    var cdocbutton = $('#cdocbutton');
    var cboxform = $('#cboxform');
    var jboxform = $('#jboxform');
    var croleform = $('#croleform');
    var cgroupform = $('#cgroupform');
    var euserform = $('#euserform');
    var cdocform = $('#cdocform');
    var edocbtn = $('#edocbtn');
    var edocform = $('#edocform');
    var vdocdiv = $('#vdocdiv');
    var deldocbtn = $('#deldocbtn');
    var deldocform = $('#deldocform');
    

    cboxbutton.click(() => {
        if (cboxform.hasClass('hidden')) {
            cboxform.removeClass('hidden');
            cboxform.show(200);
        } else {
            cboxform.addClass('hidden');
            cboxform.hide(200);
        }
    });

    jboxbutton.click(() => {
        if (jboxform.hasClass('hidden')) {
            jboxform.removeClass('hidden');
            jboxform.show(200);
        } else {
            jboxform.addClass('hidden');
            jboxform.hide(200);
        }
    });

    crolebutton.click(() => {
        if (croleform.hasClass('hidden')) {
            croleform.removeClass('hidden');
            croleform.show(200);
        } else {
            croleform.addClass('hidden');
            croleform.hide(200);
        }
    });

    cgroupbutton.click(() => {
        if (cgroupform.hasClass('hidden')) {
            cgroupform.removeClass('hidden');
            cgroupform.show(200);
        } else {
            cgroupform.addClass('hidden');
            cgroupform.hide(200);
        }
    });

    euserbutton.click(() => {
        if (euserform.hasClass('hidden')) {
            euserform.removeClass('hidden');
            euserform.show(200);
        } else {
            euserform.addClass('hidden');
            euserform.hide(200);
        }
    });

    cdocbutton.click(() => {
        if (cdocform.hasClass('hidden')) {
            cdocform.removeClass('hidden');
            cdocform.show(200);
        } else {
            cdocform.addClass('hidden');
            cdocform.hide(200);
        }
    });

    deldocbtn.click(() => {
        if (deldocform.hasClass('hidden')) {
            deldocform.removeClass('hidden');
            deldocform.show(200);
        } else {
            deldocform.addClass('hidden');
            deldocform.hide(200);
        }
    });

    edocbtn.click(() => {
        if (edocform.hasClass('hidden')) {
            console.log('stuff');
            edocform.removeClass('hidden');
            vdocdiv.addClass('hidden');
            vdocdiv.hide(100);
            edocform.show(100);
        } else {
            vdocdiv.removeClass('hidden');
            edocform.addClass('hidden');
            edocform.hide(100);
            vdocdiv.show(100);
        }
    });

});