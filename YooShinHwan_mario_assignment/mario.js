var jump = false;
var killer = false;

var killscore = 0;
var jumpscore = 0;
var totalscore = 0;
var ranking = 0;

var score_database = [];

function gumba_init() {
    $('#gumba_block').css('left', '');
    $('#gumba_block').css('right', '10px');
}

function gumba_start() {

    $('#mario_block').show(100);
    jump = false;

    var random_speed = Math.floor(Math.random() * 1000 + 2000);
    gumba_init();
    $('#gumba_block').show();

    $('#gumba_block').animate({
        'left': '0px'
    }, random_speed, function () {

        let alive = $("#mario_block").css("display"); //block 이면 생존 none 이면 사망

        if (alive == "block") {
            jumpscore = jumpscore + 100;
        }

        gumba_init();
        $('#gumba_block').hide();
        setTimeout(gumba_start, random_speed - 1000);
    })
}

function killer_start() {
    $("#killer_block").show(30);
    killer = true;
    $("#killer_block").animate({
        "left": "950px"
    }, 1000, function () {
        killer = false;
        $("#killer_block").hide();
        $("#killer_block").css("left", "50px");
    })

}
function set_score() {
    $('.kill_score').text(" 공격 점수 : " + killscore);
    $('.jump_score').text(" 방어 점수 : " + jumpscore);
    totalscore = killscore + jumpscore;
    $('.total_score').text("합계 점수 : " + totalscore);
}

function mario_down() {

    var beat = Number($("#gumba_block").css("left").replace("px", ""));
    if (beat <= 110 && jump == false) {

        $("#gumba_block").stop();
        gumba_init();

        $('#mario_block').hide();
        $('#reusltView').show();
        $('table').show();
        $('#main').css("background-image", "none");
        $('#movingIcons').hide();
        $('.playing_scores').hide();
        jump = true;
        $('#attack_score').text(" 공격 점수 : " + killscore);
        $('#defense_score').text(" 방어 점수 : " + jumpscore);
        totalscore = killscore + jumpscore;
        $('#total_score').text("합계 점수 : " + totalscore);
    }
}

function gumba_down() {
    var beat1 = Number($("#gumba_block").css("left").replace("px", ""));
    var beat2 = Number($("#killer_block").css("left").replace("px", ""));
    let random_speed = Math.floor(Math.random() * 1000);

    if (beat1 - beat2 < 50 && killer == true) {

        killscore = killscore + 150;
        $("#killer_block").stop();
        killer = false;
        $("#killer_block").hide();
        $("#killer_block").css("left", "50px");

        $("#gumba_block").stop();

        $("#gumba_block").css("left", "");
        $("#gumba_block").css("right", "10px");
        $("#gumba_block").hide();
        setTimeout(gumba_start, random_speed - 1000);
    }
}

function firstView() {
    $('#main').css("background-image", "none");
    $('#movingIcons').hide();
    $('#join_container').hide();
    $('#reusltView').hide();
    $('.playing_scores').hide();
    $('.table').hide();
    $('#scores').hide();
    $('#play_mario').hide();
    $("#join_mario").hide();
    $('.table-success').hide();
}

function play_game_open() {

    $('#play_game').click(function () {

        $('.playing_scores').show();
        $('#main').css("background-image", `url('bg.jpeg')`);
        $('.input-form').hide();
        $('#login_container').hide();
        $('.table').hide();

        $('#movingIcons').show();
        $('#firstView').hide();
        $('#scores').show();
        $('#reusltView').hide();
        gumba_start();
        $(".set_scores").show();
    })
}

function input_nicname() {
    nicname = prompt('등록할 닉네임 세글자를 입력해주세요');
    if (nicname.length > 3) {
        alert('닉네임은 세글자까지 입력 가능합니다.')
        input_nicname();
    } else if (!nicname) {
        alert('입력된 이름이 없습니다.')
        input_nicname();
    } else {
        return nicname;
    }
}

function score_upload_db() {

    upload = confirm('점수를 등록하시겠습니까?');

    if (upload) {

        var upload;
        var nicname = '';

        let score_List = [];
        let sort_score = [];
        var obj = {};

        nicname = input_nicname();

        score_List.push(obj = {

            'nicname': nicname,
            'final_totalscore': totalscore,
            'final_killscore': killscore,
            'final_jumpscore': jumpscore
        });

        score_database.push(score_List[0]);

        $('.score_table').empty();
        $('.table-success').show();

        sort_score = score_database.sort(function (a, b) {
            return b.final_totalscore - a.final_totalscore;
        });

        for (let i = 0; i < score_database.length; i++) {

            $('.score_table').append(
                `<tr>
<td class="ranking${i}"></td>
<td class="nicname${i}"></td>
<td id="final_killscore${i}"></td>
<td id="final_jumpscore${i}"></td>
<td id="final_totalscore${i}"></td>
</tr>`
            );
            $(`.nicname${i}`).text(score_database[i]['nicname']);
            $(`.ranking${i}`).text((i + 1) + '위');
            $(`#final_totalscore${i}`).text(score_database[i]['final_totalscore']);
            $(`#final_killscore${i}`).text(score_database[i]['final_killscore']);
            $(`#final_jumpscore${i}`).text(score_database[i]['final_jumpscore']);
        }
    } else {
        return;
    }
}

$(function () {

    firstView();

    killscore = 0;
    jumpscore = 0;

    $("#login_btn").click(function () {
        $("#play_mario").show();
        $("#join_mario").hide();
        $("#login_mario").hide();
        play_game_open();
    });

    $('#join').click(function () {
        $('.input-form').show();
        $('#join_mario').show();
        $('#login_mario').hide();
        $('#play_mario').hide();

        $('#join_container').show();
        $('#login_container').hide();
    })

    $('#login').click(function () {
        $('#join_mario').hide();
        $('#login_mario').show();

        $('#join_container').hide();
        $('#login_container').show();
    })

    $("body").keydown(function (event) {

        if (event.keyCode == "32" && jump == false) {
            jump = true;

            $("#mario_block")
                .animate({
                    "bottom": "200px"
                }, 500)
                .animate({
                    "bottom": "10px"
                }, 500, function () {
                    jump = false;
                });
        }
        if (event.keyCode == "13" && killer == false) {
            killer_start();
        }

    })

    $('#replay').click(function () {

        killscore = 0;
        jumpscore = 0;
        totalscore = 0;

        $('.playing_scores').show();
        $('#main').css("background-image", `url('bg.jpeg')`);
        $('.input-form').hide();
        $('#login_container').hide();
        $('table').hide();
        $('#movingIcons').show();
        $('#firstView').hide();
        $('#scores').show();
        $('#reusltView').hide();
        $(".set_scores").show();
        gumba_start();
    });

    $('#result_score_upload').click(function () {
        score_upload_db();
    });

    setTimeout(gumba_start, 1000);
    setInterval(mario_down, 10);
    setInterval(gumba_down, 10);
    setInterval(set_score, 10);

});
