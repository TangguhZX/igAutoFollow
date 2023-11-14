const Nightmare = require('nightmare');
const username = 'username';            
const password = 'password';         
                                            
var XLSX = require('xlsx')
var workbook = XLSX.readFile('List_Followers.xlsx');
var xldata = XLSX.utils.sheet_to_json(workbook.Sheets["Sheet1"]);

const nightmare = Nightmare({
    show: true,
    waitTimeout: 360000,
    gotoTimeout: 360000,
    loadTimeout: 360000,
    executionTimeout: 360000,
    webPreferences:{
        partition: 'nopersist',
        images: false,
    },
})

nightmare
    .goto('https://instagram.com')
    .wait('input[name=username]')
    .insert('input[name=username]', username)
    .insert('input[name=password]', password)
    .click('button[type="submit"]')
    .wait('input[placeholder=Search]');
    
    console.log("-------WELCOME--------------")
    console.log("   ",username)
    console.log("----------------------------")

    var nilai=0;
    function balik(){
        nightmare
        .goto('https://www.instagram.com/' + xldata[nilai].username)
        .exists('button[class="sqdOP L3NKy y3zKF "]') //check account yang udah di follow
        .then(function(result) {
            nilai++;
            if(result){
                return nightmare
                .evaluate(function(){
                    document.getElementsByTagName("button")[0].click();
                })
                .then(function(){
                console.log("Followed (Private) ",nilai+1, xldata[nilai-1].username)
                balik()
                })
            }else{
                return nightmare
                .exists('h2[class="p-error dialog"]') //Check akun Dihapus/Not Found
                .then(function(cekakun) {
                    if(cekakun){
                        console.log("Akun Sudah Dihapus ",nilai+1, xldata[nilai-1].username)
                        balik();
                    }else{
                        return nightmare
                        .wait(3500)
                        .evaluate(function(){
                            document.getElementsByTagName("button")[0].click();
                        })
                        .wait(2500)
                        .then(function(){
                            console.log("Followed ",nilai+1," ", xldata[nilai-1].username)
                            balik()
                        })
                    }   
                })
            }
        })
        .catch(function (error){
            console.log(error)
        });
    }
balik();
