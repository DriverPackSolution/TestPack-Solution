var result = {
    'melody': 0,
    'directx': 0,
    'codec': 0,
    'ping': 0,
    'tracert': 0,
    'hosts': 0,
    'torrent': 0,
    'antivirus': 0,
    'flash': 0,
    'error': 0
};
function start() {

    setTimeout(function () {
        $('.right-control').click();
        $('#next').click();
        melody();
        setTimeout(function () {
            $('#next').removeClass('disabled');
        }, 2 * 1000);
    }, 4 * 1000);

    WshShell.Run('dxdiag /x tools\\files\\dxinfo.xml', 0, true);
    setTimeout(function () {
        var dxinfo = fso.OpenTextFile('tools\\files\\dxinfo.xml', 1, false);
        var xml = dxinfo.ReadAll();
        dxinfo.Close();
        var X = xml2json_translator();
        var json = X.toObj(parseXml(xml));
        directx(json);
        codec(json);
        setTimeout(function () {
            $('.right-control').click();
        }, 8 * 1000);
    }, 2 * 1000);

    ping();
    tracert();
    hosts();
    setTimeout(function () {
        $('.right-control').click();
    }, 10 * 1000);
    torrent();
    setTimeout(function () {
        $('.right-control').click();
    }, 14 * 1000);
    antivirus();
    flash();
    errors();
}
function melody() {
    WshShell.Run('tools\\files\\notify.wav', 0, true);
    $('#melody').attr('checked', 'checked');
}
function yes() {
    setTimeout(function () {
        $('.right-control').click();
        result.melody = 1;
    }, 2 * 1000);
}

function no() {
    setTimeout(function () {
        $('.right-control').click();
    }, 2 * 1000);
}
function directx(json) {
    if (json.DxDiag.SystemInformation.DirectXVersion) {
        result.directx = 1;
    }
    $('#directx').attr('checked', 'checked');
}
function codec(json) {
    if (json.DxDiag.MediaFoundation.szByteStreamHandlers) {
        result.codec = 1;
    }
    $('#codec').attr('checked', 'checked');
    //WshShell.Run('tools\\files\\video.avi', 0, true);
}
function ping() {
    WshShell.Run("cmd /C ping google.com > files\\ping.txt", 0, true);
    setTimeout(function () {
        var pingtxt = fso.OpenTextFile('tools\\files\\ping.txt', 1, false);
        var ping = pingtxt.ReadAll();
        pingtxt.Close();
        if (ping.indexOf("(0%")) {
            $('#ping').attr('checked', 'checked');
            result.ping = 1;
        }
    }, 2 * 1000);
}
function tracert() {
    WshShell.Run("cmd /C tracert google.com > files\\tracert.txt", 0, true);
    setTimeout(function () {
        var tracerttxt = fso.OpenTextFile('tools\\files\\tracert.txt', 1, false);
        var tracert = tracerttxt.ReadAll();
        tracerttxt.Close();
        setTimeout(function () {
            if ((tracert.search("\r\n") == 0)) {
                $('#tracert').attr('checked', 'checked');
                result.tracert = 1;
            }
        }, 2 * 1000);
    }, 2 * 1000);
}
function hosts() {
    setTimeout(function () {
        var hoststxt = fso.OpenTextFile(env_windir + '\\System32\\drivers\\etc\\hosts', 1, false);
        var hosts = hoststxt.ReadAll();
        hoststxt.Close();
        setTimeout(function () {
            if (((hosts.match(/#/gim).length === 23) && (hosts.match(/\r\n/gim).length === 21))) {
                $('#hosts').attr('checked', 'checked');
                result.hosts = 1;
            }
        }, 2 * 1000);
    }, 2 * 1000);
}
function torrent() {
    WshShell.Run("cmd /C ping nnm-club.me > files\\torrent.txt", 0, true);
    setTimeout(function () {
        WshShell.Run("cmd /C ping rutracker.org >> files\\torrent.txt", 0, true);
    }, 3 * 1000);
    setTimeout(function () {
        WshShell.Run("cmd /C ping rutor.org >> files\\torrent.txt", 0, true);
    }, 7 * 1000);
    setTimeout(function () {
        var torrenttxt = fso.OpenTextFile('tools\\files\\torrent.txt', 1, false);
        var torrent = torrenttxt.ReadAll();
        torrenttxt.Close();
        if (torrent.match(/0%/gim).length === 3) {
            $('#torrent').attr('checked', 'checked');
            result.torrent = 1;
        }
    }, 10 * 1000);
}
function antivirus() {

    try {
        result.antivirus = 0;
        var objWMIService = locator.ConnectServer(null, "root\\cimv2");
        var colItems = objWMIService.ExecQuery("SELECT * FROM Win32_OperatingSystem", "WQL");
        var enumItems = new Enumerator(colItems);
        var OSVersion = enumItems.item().Version.replace(/.\d\d.*/, "");
        var objWMIService_antivir = locator.ConnectServer(null, "\\root\\SecurityCenter" + (OSVersion >= 6 ? '2' : ''));
        var colItems = objWMIService_antivir.ExecQuery("SELECT * FROM AntiVirusProduct", "WQL");
        var enumItems = new Enumerator(colItems);
        for (; !enumItems.atEnd(); enumItems.moveNext()) {
            var objItem = enumItems.item();
            if (objItem.displayName != 'Windows Defender') {
                //Get data
                antivirus[result.antivirus] = {
                    companyName: clearUndefVar(objItem.companyName),
                    displayName: clearUndefVar(objItem.displayName),
                    productState: clearUndefVar(objItem.productState),
                    instanceGuid: clearUndefVar(objItem.instanceGuid),
                    onAccessScanningEnabled: clearUndefVar(objItem.onAccessScanningEnabled),
                    pathToSignedProductExe: clearUndefVar(objItem.pathToSignedProductExe),
                    productHasNotifiedUser: clearUndefVar(objItem.productHasNotifiedUser),
                    productUptoDate: clearUndefVar(objItem.productUptoDate),
                    productWantsWscNotifications: clearUndefVar(objItem.productWantsWscNotifications),
                    versionNumber: clearUndefVar(objItem.versionNumber)
                };
                $('#antivirus').attr('checked', 'checked');
            }
        }
        return true;
    }
    catch (e) {
        return false;
    }
}
function clearUndefVar(varib) {
    try {
        varib = varib + '';
        ret = varib.replace('null', '').replace('undefined', '');
    }
    catch (e) {
        ret = '';
    }
    return ret;
}
function RegRead(key) {
    var ret = "";
    try {
        ret = WshShell.RegRead(key);
    }
    catch (e) {
        ret = "";
    }
    return ret;
}
function flash() {
    /* Юра предложил смотреть вот тут 
     * 
     * флеш-плеер HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\Adobe Flash Player ActiveX\\DisplayName
     * 
     * но на моей машине там ничего не оказалось
     */
    var flash = RegRead("HKLM\\SOFTWARE\\Classes\\.mfp\\Content Type");
    if (flash != '') {
        $('#flash').attr('checked', 'checked');
        result.flash = 1;
    }
}
function errors() {
    lib = fso.GetFolder(env_windir + "\\Minidump");
    if (lib.Files.Count > 0) {
        $('#errors').attr('checked', 'checked');
        result.errors = 1;
    }
}
function parseXml(xml) {
    var dom = null;
    if (window.DOMParser) {
        try {
            dom = (new DOMParser()).parseFromString(xml, "text/xml");
        }
        catch (e) {
            dom = null;
        }
    }
    else if (window.ActiveXObject) {
        try {
            dom = new ActiveXObject('Microsoft.XMLDOM');
            dom.async = false;
            if (!dom.loadXML(xml)) // parse error ..
                window.alert(dom.parseError.reason + dom.parseError.srcText);
        }
        catch (e) {
            dom = null;
        }
    }
    else
        alert("oops");
    return dom;
}

function navi() {
    alert(navigator.userAgent);
}