/**
 * 行を複製＋インクリメント
 */
function copyRow() {
    var table = document.getElementById("calcTable");
    var lastRow = table.rows[table.rows.length - 1];
    var newRow = lastRow.cloneNode(true);
  
    // クラス名内の連番をインクリメントするために正規表現を使用
    // 例: "class_1" -> "class_2"
    newRow.className = newRow.className.replace(/(\d+)$/, function(match, number) {
      return parseInt(number, 10) + 1;
    });
  
    // オプション: 新しい行内の特定の要素の属性を更新
    Array.from(newRow.querySelectorAll("[id],[name]")).forEach(function(element) {
      // IDの更新
      if (element.id) {
        element.id = element.id.replace(/(\d+)$/, function(match, number) {
          return parseInt(number, 10) + 1;
        });
      }
      // Nameの更新
      if (element.name) {
        element.name = element.name.replace(/(\d+)$/, function(match, number) {
          return parseInt(number, 10) + 1;
        });
      }
    });
  
    // テーブルに新しい行を追加
    var tableBody = document.getElementById("calcItem");
    tableBody.appendChild(newRow);
}

/**
 * PC用の与ダメ・被弾の初期化の共通
 */
function initPC() {
    // 初期行用意
    for (let cnt = 0; cnt < 14; cnt++){
        copyRow()
    }

    /**
     * フォーカスイベント
     */
    $(document).on("focus", "input", function () {
        // フォーカス時に選択する
        this.select();
    });

    /**
     * フォーカスイベント
     */
    $(document).on("focus", "textarea", function () {
        // フォーカス時に選択する
        this.select();
    });

    /**
     * 表計算フォーカス遷移イベント
     */
    $("#calcTable").on("blur", "input", function () {
        var recNumber = this.id.split("_")[this.id.split("_").length - 1];

        // ブランクなら0を入れる
        if (this.value == "") {
            if (this.id == "atk_" + recNumber) {
                // atkがブランクなら初期化
                clearParam(recNumber);
            }
            else {
                this.value = "0";
            }
        }

        // 数値変換
        this.value = parseFloat(this.value);

        // 対象行を計算
        calcMain(recNumber);
        
        // 選択トータルを初期化
        clearSelTotal(recNumber);
    });

    /**
     * セレクトボックス変更イベント
     */
    $(document).on("change", "select", function () {
        var recNumber = this.id.split("_")[this.id.split("_").length - 1];

        // 対象行を計算
        calcMain(recNumber);

        // 選択トータル初期化
        clearSelTotal();
    });

    /**
     * ↑入れ替え
     */
    $(document).on("click", ".up_change_link", function() {
        var recNumber = this.id.split("_")[this.id.split("_").length - 1];
        var recNext = Number(recNumber) - 1;

        // ドロップダウンメニューを閉じる
        $(".dropdown-menu").removeClass("show");

        // 行入れ替え実行
        changeParam(recNumber, recNext);

        // 再計算
        calcMain(recNumber);
        calcMain(recNext);

        return false;

    });

    /**
     * ↓入れ替え
     */
    $(document).on("click", ".down_change_link", function() {
        var recNumber = this.id.split("_")[this.id.split("_").length - 1];
        var recNext = Number(recNumber) + 1;

        // ドロップダウンメニューを閉じる
        $(".dropdown-menu").removeClass("show");

        // 行入れ替え実行
        changeParam(recNumber, recNext);

        // 再計算
        calcMain(recNumber);
        calcMain(recNext);

        return false;
    });

    /**
     * ↑コピー
     */
    $(document).on("click", ".up_copy_link", function() {
        var recNumber = this.id.split("_")[this.id.split("_").length - 1];
        var recNext = Number(recNumber) - 1;

        // ドロップダウンメニューを閉じる
        $(".dropdown-menu").removeClass("show");

        // 行コピー実行
        copyParam(recNumber, recNext);

        // コピー先を再計算
        calcMain(recNext);

        return false;
    });

    /**
     * ↓コピー
     */
    $(document).on("click", ".down_copy_link", function() {
        var recNumber = this.id.split("_")[this.id.split("_").length - 1];
        var recNext = Number(recNumber) + 1;

        // ドロップダウンメニューを閉じる
        $(".dropdown-menu").removeClass("show");

        // 行コピー実行
        copyParam(recNumber, recNext);

        // コピー先を再計算
        calcMain(recNext);

        return false;
    });

    /**
     * クリアボタンイベント
     */
    $(document).on("click", ".clear", function() {
        var recNumber = this.id.split("_")[this.id.split("_").length - 1];

        // ドロップダウンメニューを閉じる
        $(".dropdown-menu").removeClass("show");

        // 行のパラメーターを初期化
        clearParam(recNumber);

        // 選択トータル初期化
        clearSelTotal();

        return false;

    });

    /**
     * 計算結果押下イベント
     */
    $(document).on("click", ".wrap_dmg_result", function() {
        if ($(this).css("background-color") == "rgb(255, 255, 197)") {
            $(this).css({"background":""});
            selDamageTotal = selDamageTotal - Number($(this).children("output").val().replace(/,/g, ""));
            selDamageNum -= 1;
        }
        else {
            $(this).css({"background":"#FFFFC5"});
            selDamageTotal = selDamageTotal + Number($(this).children("output").val().replace(/,/g, ""));
            selDamageNum += 1;
        }
        
        $("#out_sel_total").val(Number(selDamageTotal).toLocaleString());

        if (selDamageNum > 0) {
            $(".sel_total").css({"display":"flex"})
        }
        else {
            $(".sel_total").css({"display":""})
        }
    });

    //開くボタンをクリックしたらモーダルを表示する
    $(document).on("click", ".prob_link", function() {

        var recNumber = this.id.split("_")[this.id.split("_").length - 1];

        // 行の目標ダメージを復元
        $("#enemy_hp").val($("#prob_hp_" + recNumber).val());

        if ($("#search_servant_no_" + recNumber).val() != "") {
            $("#servant-class").val($("#search_servant_class_" + recNumber).val());
            $("#servant-rare").val($("#search_servant_rare_" + recNumber).val());
            // サーヴァントセレクトボックスを再作成
            remakeServantSelectBox();
            $("#servant-name").val($("#search_servant_no_" + recNumber).val());
        }
        else if ($("#np_star_servant_no_" + recNumber).val() != "") {
            $("#servant-class").val($("#np_star_servant_class_" + recNumber).val());
            $("#servant-rare").val($("#np_star_servant_rare_" + recNumber).val());
            // サーヴァントセレクトボックスを再作成
            remakeServantSelectBox();
            $("#servant-name").val($("#np_star_servant_no_" + recNumber).val());
        }

        $("#NA").val($("#na_" + recNumber).val());
        $("#NA_buff").val($("#na_buff_" + recNumber).val());
        $("#SR").val($("#sr_" + recNumber).val());
        $("#SR_buff").val($("#sr_buff_" + recNumber).val());
        $("#b_hit").val($("#b_hit_" + recNumber).val());
        $("#a_hit").val($("#a_hit_" + recNumber).val());
        $("#q_hit").val($("#q_hit_" + recNumber).val());
        $("#ex_hit").val($("#ex_hit_" + recNumber).val());
        $("#np_hit").val($("#np_hit_" + recNumber).val());
        $("#NA_enemy").val($("#na_enemy_" + recNumber).val());
        $("#SR_enemy").val($("#sr_enemy_" + recNumber).val());

        // スリップダメージを復元
        $("#poison").val($("#poison_" + recNumber).val());
        $("#poison_buff").val($("#poison_buff_" + recNumber).val());
        $("#burn").val($("#burn_" + recNumber).val());
        $("#burn_buff").val($("#burn_buff_" + recNumber).val());
        $("#curse").val($("#curse_" + recNumber).val());
        $("#curse_buff").val($("#curse_buff_" + recNumber).val());
        $("#other_slip").val($("#other_slip_" + recNumber).val());

        // パラメーターを撃破率画面にコピー
        copyProbInput(recNumber);

        // パラメーターをNPスター計算画面にコピー
        copyNpStarInput(recNumber);

        // 撃破率計算
        calcProb();

        // NPスター計算
        calcRate();

        // スリップダメージ計算
        calcSlip();

        // 行番号を保持
        $("#prob_recNumber").val(recNumber);

        return false;
    });

    /**
     * 撃破率フォーカス遷移イベント
     */
    $("#probTable").on("blur", "input", function () {

        if (this.value == "") {this.value = "0";};

        this.value = parseFloat(this.value);

        // 撃破率計算
        calcProb();
        
        // 目標ダメージを保持
        $("#prob_hp_" + $("#prob_recNumber").val()).val($("#enemy_hp").val());
    });

    /**
     * サーヴァント検索―クラス・レアリティ変更イベント
     */
    $(document).on("change", ".servarnt-search-select", function () {
        // サーヴァントセレクトボックスを再作成
        remakeServantSelectBox();
    });

    /**
     * サーヴァント検索―サーヴァント名変更イベント
     */
    $(document).on("change", "#search_servant_name", function () {
        // サーヴァント情報表示
        servantInfo();
    });

    /**
     * サーヴァント検索―レベル変更イベント
     */
    $(document).on("change", "#search_servant_lvl", function () {
        // サーヴァント情報表示
        servantInfo();
    });

    /**
     * サーヴァント検索―宝具レベル変更イベント
     */
    $(document).on("change", "#search_servant_nplvl", function () {
        // サーヴァント情報表示
        servantInfo();
    });

    //開くボタンをクリックしたらモーダルを表示する
    $(document).on("click", ".search_link", function() {
        var recNumber = this.id.split("_")[this.id.split("_").length - 1];

        // ドロップダウンメニューを閉じる
        $(".dropdown-menu").removeClass("show");

        // サーヴァント情報を復元
        if ($("#search_servant_no_" + recNumber).val() != "") {
            $("#search_servant_class").val($("#search_servant_class_" + recNumber).val());
            $("#search_servant_rare").val($("#search_servant_rare_" + recNumber).val());
            // サーヴァントセレクトボックスを再作成
            remakeSearchServantSelectBox();
            $("#search_servant_name").val($("#search_servant_no_" + recNumber).val());
            $("#search_servant_lvl").val($("#search_servant_lvl_" + recNumber).val());
            $("#search_servant_nplvl").val($("#search_servant_nplvl_" + recNumber).val());
            $("#search_servant_fou").val($("#search_servant_fou_" + recNumber).val());
            $("#search_servant_ceatk").val($("#search_servant_ce_" + recNumber).val());
        }

        // 行番号を保持
        $("#search_recNumber").val(recNumber);

        // サーヴァント情報表示
        servantInfo();

        return false;
    });

    /**
     * サーヴァント検索―選択押下イベント
     */
    $(document).on("click", "#btnSelected", function() {

        var recNumber = $("#search_recNumber").val();

        if ($("#servant-name").val() != null) {
            // 入力初期化
            clearParamTable(recNumber);

            $(servantList).each(function() {
                
                if ($("#search_servant_name").val() == this["No"]) {

                    var atk;

                    // サーヴァント画像変更
                    setServantImage(recNumber, this["No"]);

                    switch ($("#search_servant_lvl").val()) {
                        case "MAX" :
                            atk = Number(this["MaxAtk"]);
                            break;
                        case "100" :
                            atk = rounddown(Number(this["BaseAtk"]) 
                                + (Number(this["MaxAtk"]) - Number(this["BaseAtk"])) 
                                * Number(correctio_lv100[Number(this["レアリティ"])]),0);
                            break;
                        case "110" :
                            atk = rounddown(Number(this["BaseAtk"]) 
                                + (Number(this["MaxAtk"]) - Number(this["BaseAtk"])) 
                                * Number(correctio_lv110[Number(this["レアリティ"])]),0);
                            break;
                        case "120" :
                            atk = rounddown(Number(this["BaseAtk"]) 
                                + (Number(this["MaxAtk"]) - Number(this["BaseAtk"])) 
                                * Number(correctio_lv120[Number(this["レアリティ"])]),0);
                            break;
                        default :
                            break;
                    }

                    // ATK
                    if ($("#search_servant_fou").length && $("#search_servant_ceatk").length) {
                        $("#atk_" + recNumber).val(Number(atk) + Number($("#search_servant_fou").val()) + Number($("#search_servant_ceatk").val()));
                    } else {
                        $("#atk_" + recNumber).val(Number(atk));
                    }
                    console.debug('atk', $("#atk_" + recNumber).val());
                    // 宝具倍率
                    switch ($("#search_servant_nplvl").val()) {
                        case "1" :
                            $("#np_dmg_" + recNumber).val(this["宝具Lv1"]);
                            break;
                        case "2" :
                            $("#np_dmg_" + recNumber).val(this["宝具Lv2"]);
                            break;
                        case "3" :
                            $("#np_dmg_" + recNumber).val(this["宝具Lv3"]);
                            break;
                        case "4" :
                            $("#np_dmg_" + recNumber).val(this["宝具Lv4"]);
                            break;
                        case "5" :
                            $("#np_dmg_" + recNumber).val(this["宝具Lv5"]);
                            break;
                        default :
                            break;
                    }
                    // 宝具種類
                    $("#np_kind_" + recNumber).val(this["宝具カード"]);
                    // クラススキル_カード
                    if (this["クラススキル_Bバフ"] != "0"){
                        $("#b_card_buff_" + recNumber).val(this["クラススキル_Bバフ"]);
                    }
                    if (this["クラススキル_Aバフ"] != "0") {
                        $("#a_card_buff_" + recNumber).val(this["クラススキル_Aバフ"]);
                    }
                    if (this["クラススキル_Qバフ"] != "0") {
                        $("#q_card_buff_" + recNumber).val(this["クラススキル_Qバフ"]);
                    }
                    // クラススキル_クリティカル
                    if (this["クラススキル_クリバフ"] != "0") {
                        $("#cri_buff_" + recNumber).val(this["クラススキル_クリバフ"]);
                    }
                    if (this["クラススキル_Bクリバフ"] != "0") {
                        $("#b_card_cri_buff_" + recNumber).val(this["クラススキル_Bクリバフ"]);
                    }
                    if (this["クラススキル_Aクリバフ"] != "0") {
                        $("#a_card_cri_buff_" + recNumber).val(this["クラススキル_Aクリバフ"]);
                    }
                    if (this["クラススキル_Qクリバフ"] != "0") {
                        $("#q_card_cri_buff_" + recNumber).val(this["クラススキル_Qクリバフ"]);
                    }
                    // クラススキル_宝具
                    if (this["クラススキル_宝具バフ"] != "0") {
                        $("#np_buff_" + recNumber).val(this["クラススキル_宝具バフ"]);
                    }
                    // クラススキル_固定ダメージ
                    if (this["クラススキル_固定ダメージ"] != "0") {
                        $("#fixed_dmg_" + recNumber).val(this["クラススキル_固定ダメージ"]);
                    }
                    // クラス相性
                    switch (this["クラス"]) {
                        case "剣" :
                        case "騎" :
                            $("#class_affinity_" + recNumber).val("2.0");
                            $("#class_servant_" + recNumber).val("1.00");
                            break;
                        case "弓" :
                            $("#class_affinity_" + recNumber).val("2.0");
                            $("#class_servant_" + recNumber).val("0.95");
                            break;
                        case "槍" :
                            $("#class_affinity_" + recNumber).val("2.0");
                            $("#class_servant_" + recNumber).val("1.05");
                            break;
                        case "術" :
                        case "殺" :
                            $("#class_affinity_" + recNumber).val("2.0");
                            $("#class_servant_" + recNumber).val("0.90");
                            break;
                        case "狂" :
                            $("#class_affinity_" + recNumber).val("1.5");
                            $("#class_servant_" + recNumber).val("1.10");
                            break;
                        case "盾" :
                        case "月" :
                        case "降" :
                            $("#class_affinity_" + recNumber).val("1.0");
                            $("#class_servant_" + recNumber).val("1.00");
                            break;
                        case "裁" :
                        case "讐" :
                            $("#class_affinity_" + recNumber).val("1.0");
                            $("#class_servant_" + recNumber).val("1.10");
                            break;
                        case "分" :
                        case "詐" :
                        case "獣" :
                            $("#class_affinity_" + recNumber).val("1.5");
                            $("#class_servant_" + recNumber).val("1.00");
                            break;
                        default :
                            break;
                    }

                    if ($("#na_" + recNumber).length) {
                        $("#na_" + recNumber).val(this["N_N/A"]);
                    }
                    if ($("#na_buff_" + recNumber).length) {
                        $("#na_buff_" + recNumber).val(this["N_N/A_バフ"]);
                    }
                    if ($("#sr_" + recNumber).length) {
                        $("#sr_" + recNumber).val(this["SR"]);
                    }
                    if ($("#sr_buff_" + recNumber).length) {
                        $("#sr_buff_" + recNumber).val(this["クラススキル_スター獲得バフ"]);
                    }
                    
                    $("#b_hit_" + recNumber).val(this["BHIT"]);
                    $("#a_hit_" + recNumber).val(this["AHIT"]);
                    $("#q_hit_" + recNumber).val(this["QHIT"]);
                    $("#np_hit_" + recNumber).val(this["宝具HIT"]);

                    if ($("#ex_hit_" + recNumber).length) {
                        $("#ex_hit_" + recNumber).val(this["EXHIT"]);
                    }

                    if ($("#na_enemy_" + recNumber).length) {
                        $("#na_enemy_" + recNumber).val(this["クラス"]);
                    }

                    // hidden
                    $("#search_servant_class_" + recNumber).val($("#search_servant_class").val());
                    $("#search_servant_rare_" + recNumber).val($("#search_servant_rare").val());
                    $("#search_servant_lvl_" + recNumber).val($("#search_servant_lvl").val());
                    $("#search_servant_no_" + recNumber).val(this["No"]);

                    if ($("#search_servant_nplvl_" + recNumber).length) {
                        $("#search_servant_nplvl_" + recNumber).val($("#search_servant_nplvl").val());
                    }
                    if ($("#search_servant_fou_" + recNumber).length) {
                        $("#search_servant_fou_" + recNumber).val($("#search_servant_fou").val());
                    }
                    if ($("#search_servant_ce_" + recNumber).length) {
                        $("#search_servant_ce_" + recNumber).val($("#search_servant_ceatk").val());
                    }

                    var caseClass;
                    switch (this["クラス"]) {
                        case "剣" :
                            caseClass = "Saber"
                            break;
                        case "弓" :
                            caseClass = "Archer"
                            break;
                        case "槍" :
                            caseClass = "Lancer"
                            break;
                        case "騎" :
                            caseClass = "Rider"
                            break;
                        case "術" :
                            caseClass = "Caster"
                            break;
                        case "殺" :
                            caseClass = "Assasin"
                            break;
                        case "狂" :
                            caseClass = "Berserker"
                            break;
                        case "裁" :
                        case "讐" :
                        case "月" :
                        case "盾" :
                            caseClass = "EX1"
                            break;
                        case "分" :
                        case "降" :
                        case "詐" :
                        case "獣" :
                            caseClass = "EX2"
                            break;
                        default :
                            break;
                    }

                    // クラススコア反映
                    if (window.classScoreDataList) {
                        $(classScoreDataList).each(function() {

                            if (this.class == caseClass) {
                                $("#b_card_power_buff_" + recNumber).val(BigNumber(parseFloat($("#b_card_power_buff_" + recNumber).val())).plus(parseFloat(this.b_card_power_buff)));
                                $("#a_card_power_buff_" + recNumber).val(BigNumber(parseFloat($("#a_card_power_buff_" + recNumber).val())).plus(parseFloat(this.a_card_power_buff)));
                                $("#q_card_power_buff_" + recNumber).val(BigNumber(parseFloat($("#q_card_power_buff_" + recNumber).val())).plus(parseFloat(this.q_card_power_buff)));
                                $("#cri_buff_" + recNumber).val(BigNumber(parseFloat($("#cri_buff_" + recNumber).val())).plus(parseFloat(this.cri_buff)));
                                $("#b_card_cri_buff_" + recNumber).val(BigNumber(parseFloat($("#b_card_cri_buff_" + recNumber).val())).plus(parseFloat(this.b_card_cri_buff)));
                                $("#a_card_cri_buff_" + recNumber).val(BigNumber(parseFloat($("#a_card_cri_buff_" + recNumber).val())).plus(parseFloat(this.a_card_cri_buff)));
                                $("#q_card_cri_buff_" + recNumber).val(BigNumber(parseFloat($("#q_card_cri_buff_" + recNumber).val())).plus(parseFloat(this.q_card_cri_buff)));
                                $("#np_buff_" + recNumber).val(BigNumber(parseFloat($("#np_buff_" + recNumber).val())).plus(parseFloat(this.np_buff)));
                                $("#ex_atk_buff_" + recNumber).val(BigNumber(parseFloat($("#ex_atk_buff_" + recNumber).val())).plus(parseFloat(this.ex_atk_buff)));
                                $("#sr_buff_" + recNumber).val(BigNumber(parseFloat($("#sr_buff_" + recNumber).val())).plus(parseFloat(this.sr_buff)));
    
                                return;
                            }    
                        });
                    }

                    return;
                }
            });
        }

        // 再計算
        calcMain(recNumber)
        
        return true;
    });

    /**
     * セレクトボックス変更イベント
     */
    $(document).on("change", ".select_np_star", function () {
        // NPスター計算
        calcRate();

        // バフを保持

        // 与ダメ専用
        $("#na_" + $("#prob_recNumber").val()).val($("#NA").val());
        $("#sr_" + $("#prob_recNumber").val()).val($("#SR").val());
        $("#sr_buff_" + $("#prob_recNumber").val()).val($("#SR_buff").val());
        $("#sr_enemy_" + $("#prob_recNumber").val()).val($("#SR_enemy").val());
        $("#ex_hit_" + $("#prob_recNumber").val()).val($("#ex_hit").val());

        // 被ダメ専用
        $("#nd_" + $("#prob_recNumber").val()).val($("#ND").val());
        $("#nd_buff_" + $("#prob_recNumber").val()).val($("#ND_buff").val());

        // 共通
        $("#na_buff_" + $("#prob_recNumber").val()).val($("#NA_buff").val());
        $("#b_hit_" + $("#prob_recNumber").val()).val($("#b_hit").val());
        $("#a_hit_" + $("#prob_recNumber").val()).val($("#a_hit").val());
        $("#q_hit_" + $("#prob_recNumber").val()).val($("#q_hit").val());
        $("#np_hit_" + $("#prob_recNumber").val()).val($("#np_hit").val());
        $("#na_enemy_" + $("#prob_recNumber").val()).val($("#NA_enemy").val());
    });

    //サーヴァント情報を反映させる
    $(document).on("click", "#btn-apply", function() {
        if (servantApply()) {
            // NPスター計算
            calcRate();
            // サーヴァント情報を保持
            $("#np_star_servant_no_" + $("#prob_recNumber").val()).val($("#servant-name").val());
            $("#np_star_servant_class_" + $("#prob_recNumber").val()).val($("#servant-class").val());
            $("#np_star_servant_rare_" + $("#prob_recNumber").val()).val($("#servant-rare").val());

            // バフを保持
            $("#nd_" + $("#prob_recNumber").val()).val($("#ND").val());
            $("#nd_buff_" + $("#prob_recNumber").val()).val($("#ND_buff").val());

            $("#na_" + $("#prob_recNumber").val()).val($("#NA").val());
            $("#na_buff_" + $("#prob_recNumber").val()).val($("#NA_buff").val());
            $("#sr_" + $("#prob_recNumber").val()).val($("#SR").val());
            $("#sr_buff_" + $("#prob_recNumber").val()).val($("#SR_buff").val());
            $("#b_hit_" + $("#prob_recNumber").val()).val($("#b_hit").val());
            $("#a_hit_" + $("#prob_recNumber").val()).val($("#a_hit").val());
            $("#q_hit_" + $("#prob_recNumber").val()).val($("#q_hit").val());
            $("#ex_hit_" + $("#prob_recNumber").val()).val($("#ex_hit").val());
            $("#np_hit_" + $("#prob_recNumber").val()).val($("#np_hit").val());
            $("#na_enemy_" + $("#prob_recNumber").val()).val($("#NA_enemy").val());
            $("#sr_enemy_" + $("#prob_recNumber").val()).val($("#SR_enemy").val());
        }

        return false;
    });

    /**
     * サーヴァント検索―クラス・レアリティ変更イベント
     */
    $(document).on("change", ".search_sarvant_select", function () {
        // サーヴァントセレクトボックスを再作成
        remakeSearchServantSelectBox();

        // サーヴァント情報表示
        servantInfo();
    });
}