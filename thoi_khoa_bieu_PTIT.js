// ==UserScript==
// @name        QLDT supporter by ToiYeuPTIT
// @author      ToiYeuPTIT
// @version     2.0.0
// @include     *
// @run-at      document-start
// @require http://code.jquery.com/jquery-2.1.0.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.23.0/moment.min.js
// @require     https://cdn.jsdelivr.net/npm/axios@v1.0.0-alpha.1/dist/axios.min.js
// @updateURL https://toiyeuptit.com/script/qldt_script.js
// @license MIT
// ==/UserScript==

let semester_start_date = '14/08/2023'
var convert = {
    "07:00": 1,
    "08:00": 2,
    "09:00": 3,
    "10:00": 4,
    "11:00": 5,
    "12:00": 6,
    "13:00": 7,
    "14:00": 8,
    "15:00": 9,
    "16:00": 10,
    "17:00": 11,
    "18:00": 12,
    "19:00": 13,
    "20:00": 14
};

var convert_end_time = {
    "07:50": 1,
    "08:50": 2,
    "09:50": 3,
    "10:50": 4,
    "11:50": 5,
    "12:50": 6,
    "13:50": 7,
    "14:50": 8,
    "15:50": 9,
    "16:50": 10,
    "17:50": 11,
    "18:50": 12,
    "19:50": 13,
    "20:50": 14
};

function createArray(length)
{
    var arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1)
    {
        var args = Array.prototype.slice.call(arguments, 1);
        while (i--)
            arr[length - 1 - i] = createArray.apply(this, args);
    }
    return arr;
}
function waitForElm(selector)
{
    return new Promise(resolve =>
    {
        if (document.querySelector(selector))
        {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations =>
        {
            if (document.querySelector(selector))
            {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

waitForElementToDisplay("div.card-body.p-0 div.row.d-flex.justify-content-center.text-nowrap.pt-1", function ()
{
    //console.log("Hello ^^,")
    var rows = 14; //here's your number of rows and columns
    var cols = 80;
    var tables = [];
    var m1 = new Map();
    var m2 = new Map();
    var course_list = new Map();
    var tkb_div = $('<div style="background-image: url(https://toiyeuptit.com/script/logo.jpg); background-position: top center; background-repeat: no-repeat; background-size: 25%;" id="tkb_div"></div>');
    var text_div = $('<div style="" id="text_div"></div>');
    var table_data = createArray(3, rows * cols);
    var SERVED = "v";
    var AVAILABLE = " ";
    var DUPLICATED = "x";
    let current_user = JSON.parse(sessionStorage.getItem("CURRENT_USER"));
    const config = {
        headers: {
            "Content-type": "application/json",
            "Authorization": `Bearer ${current_user.access_token}`,
        },
    };

    let start_date_dict = {};
    axios.post('/api/sch/w-locdshockytkbuser', { "filter": { "is_tieng_anh": null }, "additional": { "paging": { "limit": 100, "page": 1 }, "ordering": [{ "name": "hoc_ky", "order_type": 1 }] } }, config)
        .then(function (response)
        {
            let ds_hoc_ky = response.data.data.ds_hoc_ky;
            ds_hoc_ky.forEach((value, key) =>
            {
                start_date_dict[value.ten_hoc_ky.toUpperCase()] = value.ngay_bat_dau_hk;
            });
        })
        .catch(function (error)
        {
            console.log(error);
        });

    for (var tmp1738 = 1; tmp1738 < 3; tmp1738++) for (var tmp1739 = 0; tmp1739 < rows * cols; tmp1739++) table_data[tmp1738][tmp1739] = new Map();
    for (var i = 0; i < 2; i++)
    {
        var table_id = "tkb_preview_table" + (i + 1);
        tables[i] = $('<table style="text-align:center;border-collapse: collapse; width: 98%; margin: 0 auto;" class="tkb_preview_table" id=' + table_id + '><thead><tr class="bg-primary text-center text-nowrap"> <th></th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th>|</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th>|</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th>|</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th>|</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th>|</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th>|</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th>|</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th>|</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th>|</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th>|</th> </tr></thead><tbody>');
        var tkb_separator, start_time_in_hr;
        for (var r = 0; r < rows; r++)
        {
            if (r == 4 || r == 5 || r == 10) tkb_separator = 'border-bottom:2px solid blue;'
            else tkb_separator = '';
            start_time_in_hr = r + 7;
            var tr = $('<tr style="line-height: 14px; height:1px;' + tkb_separator + '"><td>' + start_time_in_hr + '</td>');
            for (var c = 0; c < cols; c++)
            {
                if ((c + 1) % 8)
                    $('<td ud_id="' + (r * cols + c) + '" class="bvk_table_cell" style="border:solid green 1px;height:1px;">' + AVAILABLE + '</td>').appendTo(tr);
                else
                    $('<td ud_id="' + (r * cols + c) + '" class="bvk_table_cell" style="height:0px;"></td>').appendTo(tr);
            }
            tr.appendTo(tables[i]);
        }
        $('</tbody></table>').appendTo(tables[i]);
        tkb_div.append(tables[i])
    }

    // tables[1].after($('<p><span style="margin-left: 2%;">Đội ngũ <span style="color: red;">Tôi Yêu PTIT</span> vận hành và phát triển group <a target="new" style="color:blue;" href="https://www.facebook.com/groups/d23ptithanoi">D23 PTIT Hà Nội</a> Chúng mình thường xuyên cập nhật phần mềm và thông báo qua group này, nếu bạn muốn cập nhật phiên bản thường xuyên hãy tham gia group nhé!</span></p>'))
    // tables[1].after($('<p><span style="margin-left: 2%;">Script chỉ hiển thị thông tin dựa vào sự kiện click chuột, không hề can thiệp gì đến quá trình đăng kí tín chỉ!</span></p>'))
    $("div.card-body.p-0 div.row.d-flex.justify-content-center.text-nowrap.pt-1").prepend(tkb_div)
    tkb_div.css("background-color", "transparent")
    text_div.append('<p style="margin-left: 1%; width: 100%;">Script chỉ hiển thị thông tin dựa vào sự kiện click chuột, không hề can thiệp gì đến quá trình đăng kí tín chỉ!</p>');
    text_div.append('<p style="margin-left: 1%; width: 100%; word-wrap: break-word !important;">Đội ngũ <span style="color: red;">Tôi Yêu PTIT</span> vận hành và phát triển group <a target="new" style="color:blue;" href="https://www.facebook.com/groups/d23ptithanoi">D23 PTIT Hà Nội</a>.</p>');
    text_div.append('<p style="margin-left: 1%; width: 100%;">Chúng mình thường xuyên cập nhật phần mềm và thông báo qua group này, nếu bạn muốn cập nhật phiên bản thường xuyên hãy tham gia group nhé!</p>');
    tkb_div.append(text_div);
    $("div.row.p-1 div.col-12").append("<div id=bvk_tooltip style='display:none;background-color:yellow; color: black; width=500px;'></div>")
    $(document).on("mouseover", "#tkb_preview_table1 td", function (e)
    {
        $("#bvk_tooltip").offset({ left: e.pageX, top: e.pageY });
        var index_1305 = $(this).attr('ud_id')
        var text_1313 = '';
        table_data[1][index_1305].forEach((value, key) =>
        {
            text_1313 += value + "<br>";
        });
        $("#bvk_tooltip").html(text_1313);
        $("#bvk_tooltip").show("slow");
    })
    $(document).on("mouseover", "#tkb_preview_table2 td", function (e)
    {
        $("#bvk_tooltip").offset({ left: e.pageX, top: e.pageY });
        var index_1305 = $(this).attr('ud_id')
        var text_1313 = '';
        table_data[2][index_1305].forEach((value, key) =>
        {
            text_1313 += value + "<br>";
        });
        $("#bvk_tooltip").html(text_1313);
        $("#bvk_tooltip").show("slow");
    })
    $(document).on("mouseover", "body", function ()
    {
        $("tbody tr.text-muted.ng-star-inserted").each(function ()
        {
            var course = $(this).find('td')
            var remain = course.eq(8).text();
            if (remain == "0")
                $(this).css('background-color', '#FFAAAA');
        })
    })
    $(document).on("click", "tbody tr.text-muted.ng-star-inserted", function ()
    {
        var course = $(this).find('td')
        var weeks = []
        var day_of_week = []
        var start_time = []
        var duration_time = []
        var subject_code = course.eq(1).text();
        var subject_name = course.eq(2).text();
        var subject_group = course.eq(3).text();
        var subject_tth = course.eq(4).text();
        var time_detail = course.eq(9).html();
        var teacher_array = [];
        //const regex = /(Thứ (\d+)|(Chủ nhật)),từ ([0-9:]+) đến ([0-9:]+),Ph (.*?),GV (.*?),(.*?)</gm;

        // Alternative syntax using RegExp constructor
        const regex = new RegExp('(Thứ (\\d+)|(Chủ nhật)),từ ([0-9:]+) đến ([0-9:]+),Ph (.*?),GV (.*?),(.*?)<', 'gm')

        let m;

        while ((m = regex.exec(time_detail)) !== null)
        {
            // This is necessary to avoid infinite loops with zero-width matches
            if (m.index === regex.lastIndex)
                regex.lastIndex++;
            var before_start_time, now_end_time;
            // The result can be accessed through the `m`-variable.
            m.forEach((match, groupIndex) =>
            {
                if (groupIndex == 8)
                {
                    let split_date = match.split(' đến ');
                    let start_date = split_date[0];
                    let end_date = split_date[split_date.length - 1];
                    let from_week, to_week;
                    let semester_title = $("div.ng-star-inserted div.card.shadow-lg.mb-2 div.card-header.text-white.text-uppercase.bg-primary").text()
                    semester_title = semester_title.replace('Đăng ký môn học', '').trim().toUpperCase()
                    semester_title = semester_title.replace(' - NĂM', ' NĂM')
                    if (start_date_dict.hasOwnProperty(semester_title))
                    {
                        semester_start_date = start_date_dict[semester_title]
                    }
                    var semester_start_mdate = moment(semester_start_date, 'DD/MM/YYYY');
                    var start_mdate = moment(start_date, 'DD/MM/YYYY');
                    var end_mdate = moment(end_date, 'DD/MM/YYYY');
                    from_week = start_mdate.diff(semester_start_mdate, 'weeks') + 1;
                    to_week = end_mdate.diff(semester_start_mdate, 'weeks') + 1;

                    var tmp_151 = [];
                    for (var i = from_week; i <= to_week; i++)
                    {
                        tmp_151.push(i);
                    }
                    weeks.push(tmp_151);
                }
                else if (groupIndex == 5)
                {
                    // now_end_time = convert_end_time[match] // Tiết kết thúc;
                    duration_time.push(convert_end_time[match] - before_start_time) // Số tiết
                }
                else if (groupIndex == 4)
                {
                    start_time.push(convert[match] - 1) // Tiết bắt đầu
                    before_start_time = convert[match] - 1;
                }
                else if (groupIndex == 1)
                {
                    var data = match.toUpperCase();
                    switch (data)
                    {
                        case "THỨ 2":
                            day_of_week.push(0);
                            break;

                        case "THỨ 3":
                            day_of_week.push(1);
                            break;

                        case "THỨ 4":
                            day_of_week.push(2);
                            break;

                        case "THỨ 5":
                            day_of_week.push(3);
                            break;

                        case "THỨ 6":
                            day_of_week.push(4);
                            break;

                        case "THỨ 7":
                            day_of_week.push(5);
                            break;

                        case "CHỦ NHẬT":
                            day_of_week.push(6);
                            break;
                    }
                }
                else if (groupIndex == 7)
                    teacher_array.push(match);
            });
        }


        let uniqueTeachers = [...new Set(teacher_array)]
        var subject_teacher = uniqueTeachers.join(', ');
        if (m1.get(subject_code) != undefined)
        {
            var tmp_213 = m1.get(subject_code);
            for (i = 0; i < tmp_213.length; i++)
            {
                if ($("#tkb_preview_table1").find('td.bvk_table_cell').eq(tmp_213[i]).html() == DUPLICATED)
                { // trung
                    $("#tkb_preview_table1").find('td.bvk_table_cell').eq(tmp_213[i]).html(SERVED);
                    $("#tkb_preview_table1").find('td.bvk_table_cell').eq(tmp_213[i]).css("background-color", "#00FF00"); //green
                }
                else
                {
                    $("#tkb_preview_table1").find('td.bvk_table_cell').eq(tmp_213[i]).html(AVAILABLE);
                    $("#tkb_preview_table1").find('td.bvk_table_cell').eq(tmp_213[i]).css("background-color", "#FFFFFF"); //white
                    // $("#tkb_preview_table1").find('td.bvk_table_cell').eq(tmp_213[i]).prop('value', '');
                }
            }
            tmp_213 = m2.get(subject_code);
            for (i = 0; i < tmp_213.length; i++)
            {
                if ($("#tkb_preview_table2").find('td.bvk_table_cell').eq(tmp_213[i]).html() == DUPLICATED)
                { // trung
                    $("#tkb_preview_table2").find('td.bvk_table_cell').eq(tmp_213[i]).html(SERVED);
                    $("#tkb_preview_table2").find('td.bvk_table_cell').eq(tmp_213[i]).css("background-color", "#00FF00"); //green
                }
                else
                {
                    $("#tkb_preview_table2").find('td.bvk_table_cell').eq(tmp_213[i]).html(AVAILABLE);
                    $("#tkb_preview_table2").find('td.bvk_table_cell').eq(tmp_213[i]).css("background-color", "#FFFFFF"); //white
                    // $("#tkb_preview_table2").find('td.bvk_table_cell').eq(tmp_213[i]).prop('value', '');
                }
            }
            for (i = 1; i < 3; i++)
                for (j = 0; j < rows * cols; j++)
                    table_data[i][j].delete(subject_code)
        }
        if (weeks.length != day_of_week.length)
            alert("Hệ thống đang bị lỗi môn này!");
        else
        {
            var table1 = [];
            var table2 = [];
            for (i = 0; i < weeks.length; i++)
            {
                var crr_dow = day_of_week[i];
                var crr_st = start_time[i];
                var crr_dt = duration_time[i];
                var crr_aw = weeks[i]; // Tuần học
                for (var j = 0; j < crr_aw.length; j++) // Duyệt từng tuần học
                {
                    var crr_w = crr_aw[j] - 1; //array start count from 0
                    if (crr_w < 10)
                    {
                        for (var k = 0; k < crr_dt; k++)
                            table1.push(crr_dow + crr_w * 8 + (crr_st + k) * 80);
                        // if (crr_dt == 4)
                        // {
                        //     table1.push(crr_dow + crr_w * 8 + (crr_st + 1) * 80);
                        // }
                    }
                    else
                    {
                        crr_w -= 10;
                        for (var k = 0; k < crr_dt; k++)
                            table2.push(crr_dow + crr_w * 8 + (crr_st + k) * 80);
                        // if (crr_dt == 4)
                        // {
                        //     table2.push(crr_dow + crr_w * 8 + (crr_st + 1) * 80);
                        // }
                    }
                }
            }

            table1 = table1.filter(function (item, index)
            {
                return table1.indexOf(item) === index;
            })
            table2 = table2.filter(function (item, index)
            {
                return table2.indexOf(item) === index;
            })
            m1.set(subject_code, table1);
            m2.set(subject_code, table2);
            if (m1.get(subject_code) != undefined)
            {
                var tmp_219 = m1.get(subject_code);
                for (i = 0; i < tmp_219.length; i++)
                {
                    if ($("#tkb_preview_table1").find('td.bvk_table_cell').eq(tmp_219[i]).text() == SERVED)
                    { // da co mon tu truoc
                        $("#tkb_preview_table1").find('td.bvk_table_cell').eq(tmp_219[i]).css("background-color", "#FF0000"); //red
                        $("#tkb_preview_table1").find('td.bvk_table_cell').eq(tmp_219[i]).html(DUPLICATED);
                    }
                    else
                    {
                        $("#tkb_preview_table1").find('td.bvk_table_cell').eq(tmp_219[i]).css("background-color", "#00FF00"); // green
                        // $("#tkb_preview_table1").find('td.bvk_table_cell').eq(tmp_219[i]).prop('value', subject_code); // green
                        $("#tkb_preview_table1").find('td.bvk_table_cell').eq(tmp_219[i]).html(SERVED);
                    }
                    table_data[1][tmp_219[i]].set(subject_code, subject_name + " - " + subject_group + " - " + subject_tth + " - " + subject_teacher)
                    course_list.set(subject_code, subject_name + " - " + subject_group + " - " + subject_tth + " - " + subject_teacher)
                }
                tmp_219 = m2.get(subject_code);
                for (i = 0; i < tmp_219.length; i++)
                {
                    if ($("#tkb_preview_table2").find('td.bvk_table_cell').eq(tmp_219[i]).text() == SERVED)
                    { // da co mon tu truoc
                        $("#tkb_preview_table2").find('td.bvk_table_cell').eq(tmp_219[i]).css("background-color", "#FF0000"); //red
                        $("#tkb_preview_table2").find('td.bvk_table_cell').eq(tmp_219[i]).html(DUPLICATED);
                    }
                    else
                    {
                        $("#tkb_preview_table2").find('td.bvk_table_cell').eq(tmp_219[i]).css("background-color", "#00FF00"); //green
                        // $("#tkb_preview_table2").find('td.bvk_table_cell').eq(tmp_219[i]).prop('value', subject_code); //green
                        $("#tkb_preview_table2").find('td.bvk_table_cell').eq(tmp_219[i]).html(SERVED);
                    }
                    table_data[2][tmp_219[i]].set(subject_code, subject_name + " - " + subject_group + " - " + subject_tth + " - " + subject_teacher)
                    course_list.set(subject_code, subject_name + " - " + subject_group + " - " + subject_tth + " - " + subject_teacher)
                }
            }
        }
        $("div.card-body.p-0 div.row.d-flex.justify-content-center.text-nowrap.pt-1").find('span.course_list_element').map(function ()
        {
            $(this).remove()
        })

        course_list.forEach((value, key) =>
        {
            $("div.card-body.p-0 div.row.d-flex.justify-content-center.text-nowrap.pt-1").append("<span style='margin-left: 2%;' class='course_list_element'>" + value + "<br></span>")
        });
    });
}, 1000, 10000000);

function waitForElementToDisplay(selector, callback, checkFrequencyInMs, timeoutInMs)
{
    var startTimeInMs = Date.now();
    (function loopSearch()
    {
        if (document.querySelector(selector) != null)
        {
            // when url is changed, reload page
            var oldHref = "dangkymonhoc";
            setInterval(function ()
            {
                if (!window.location.href.endsWith(oldHref))
                {
                    // Now the URL has changed, do stuff here
                    oldHref = "###";
                    window.location.reload();
                }
            }, 1000); // check every second
            callback();
            return;
        }
        else
        {
            setTimeout(function ()
            {
                if (timeoutInMs && Date.now() - startTimeInMs > timeoutInMs)
                    return;
                loopSearch();
            }, checkFrequencyInMs);
        }
    })();
}
