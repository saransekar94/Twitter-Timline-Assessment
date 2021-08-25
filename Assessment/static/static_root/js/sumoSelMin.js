/*!
 * jquery.sumoselect - v3.0.2
 * http://hemantnegi.github.io/jquery.sumoselect
 */
! function(e) {
    "namespace sumo";
    e.fn.SumoSelect = function(t) {
        var l = e.extend({
                placeholder: "Select Here",
                csvDispCount: 3,
                captionFormat: "{0} Selected",
                captionFormatAllSelected: "{0} all selected!",
                floatWidth: 400,
                forceCustomRendering: !1,
                nativeOnDevice: ["Android", "BlackBerry", "iPhone", "iPad", "iPod", "Opera Mini", "IEMobile", "Silk"],
                outputAsCSV: !1,
                csvSepChar: ",",
                okCancelInMulti: !1,
                triggerChangeCombined: !0,
                selectAll: !1,
                search: !1,
                searchText: "Search...",
                noMatch: 'No matches for "{0}"',
                prefix: "",
                locale: ["OK", "Cancel", "Select All"],
                up: !1
            }, t),
            s = this.each(function() {
                var t = this;
                !this.sumo && e(this).is("select") && (this.sumo = {
                    E: e(t),
                    is_multi: e(t).attr("multiple"),
                    is_multi_sigle_sel : e(t).attr("multipleSingle"), 
                    select: "",
                    caption: "",
                    placeholder: "",
                    optDiv: "",
                    CaptionCont: "",
                    ul: "",
                    is_floating: !1,
                    is_opened: !1,
                    mob: !1,
                    Pstate: [],
                    createElems: function() {
                        var t = this;
                        return t.E.wrap('<div class="SumoSelect" tabindex="0">'), t.select = t.E.parent(), t.caption = e("<span>"), t.CaptionCont = e('<p class="CaptionCont"><label><i></i></label></p>').addClass("SelectBox").attr("style", t.E.attr("style")).prepend(t.caption), t.select.append(t.CaptionCont), t.is_multi || t.is_multi_sigle_sel || (l.okCancelInMulti = !1), t.E.attr("disabled") && t.select.addClass("disabled").removeAttr("tabindex"), l.outputAsCSV && t.is_multi && t.is_multi_sigle_sel && t.E.attr("name") && (t.select.append(e('<input class="HEMANT123" type="hidden" />').attr("name", t.E.attr("name")).val(t.getSelStr())), t.E.removeAttr("name")), t.isMobile() && !l.forceCustomRendering ? void t.setNativeMobile() : (t.E.attr("name") && t.select.addClass("sumo_" + t.E.attr("name")), t.E.addClass("SumoUnder").attr("tabindex", "-1"), t.optDiv = e('<div class="optWrapper ' + (l.up ? "up" : "") + '">'), t.floatingList(), t.ul = e('<ul class="options">'), t.optDiv.append(t.ul), l.selectAll && t.SelAll(), l.search && t.Search(), t.ul.append(t.prepItems(t.E.children())), t.is_multi && t.is_multi_sigle_sel && t.multiSelelect(), t.select.append(t.optDiv), t.basicEvents(), void t.selAllState())
                    },
                    prepItems: function(t, l) {
                        var i = [],
                            s = this;
                        return e(t).each(function(t, n) {
                            n = e(n), i.push(n.is("optgroup") ? e('<li class="group ' + (n[0].disabled ? "disabled" : "") + '"><label>' + n.attr("label") + "</label><ul></ul><li>").find("ul").append(s.prepItems(n.children(), n[0].disabled)).end() : s.createLi(n, l))
                        }), i
                    },
                    createLi: function(t, l) {
                        var i = this;
                        return t.attr("value") || t.attr("value", t.val()), li = e('<li class="opt"><label>' + t.text() + "</label></li>"), li.data("opt", t), t.data("li", li), i.is_multi && i.is_multi_sigle_sel && li.prepend("<span><i></i></span>"), (t[0].disabled || l) && (li = li.addClass("disabled")), i.onOptClick(li), ( !i.is_multi_sigle_sel && t[0].selected) && li.addClass("selected"), t.attr("class") && li.addClass(t.attr("class")), li
                    },
                    getSelStr: function() {
                        return sopt = [], this.E.find("option:selected").each(function() {
                            sopt.push(e(this).val())
                        }), sopt.join(l.csvSepChar)
                    },
                    multiSelelect: function() {
                        var t = this;
                        t.optDiv.addClass("multiple"), t.okbtn = e('<p class="btnOk">' + l.locale[0] + "</p>").click(function() {
                            l.triggerChangeCombined && (changed = !1, t.E.find("option:selected").length != t.Pstate.length ? changed = !0 : t.E.find("option").each(function(e, l) {
                                l.selected && t.Pstate.indexOf(e) < 0 && (changed = !0)
                            }), changed && (t.callChange(), t.setText())), t.hideOpts()
                        }), t.cancelBtn = e('<p class="btnCancel">' + l.locale[1] + "</p>").click(function() {
                            t._cnbtn(), t.hideOpts()
                        }), t.optDiv.append(e('<div class="MultiControls">').append(t.okbtn).append(t.cancelBtn))
                    },
                    _cnbtn: function() {
                        var e = this;
                        e.E.find("option:selected").each(function() {
                            this.selected = !1
                        }), e.optDiv.find("li.selected").removeClass("selected");
                        for (var t = 0; t < e.Pstate.length; t++) e.E.find("option")[e.Pstate[t]].selected = !0, e.ul.find("li.opt").eq(e.Pstate[t]).addClass("selected");
                        e.selAllState()
                    },
                    SelAll: function() {
                        var t = this;
                        t.is_multi && t.is_multi_sigle_sel && (t.selAll = e('<p class="select-all"><span><i></i></span><label>' + l.locale[2] + "</label></p>"), t.selAll.on("click", function() {
                            t.selAll.toggleClass("selected"), t.optDiv.find("li.opt").not(".hidden").each(function(l, i) {
                                i = e(i), t.selAll.hasClass("selected") ? i.hasClass("selected") || i.trigger("click") : i.hasClass("selected") && i.trigger("click")
                            })
                        }), t.optDiv.prepend(t.selAll))
                    },
                    Search: function() {
                        var t = this,
                            i = t.CaptionCont.addClass("search"),
                            s = e('<p class="no-match">');
                        t.ftxt = e('<input type="text" class="search-txt" value="" placeholder="' + l.searchText + '">').on("click", function(e) {
                            e.stopPropagation()
                        }), i.append(t.ftxt), t.optDiv.children("ul").after(s), t.ftxt.on("keyup.sumo", function() {
                            var i = t.optDiv.find("ul.options li.opt").each(function(l, i) {
                                i = e(i), i.text().toLowerCase().indexOf(t.ftxt.val().toLowerCase()) > -1 ? i.removeClass("hidden") : i.addClass("hidden")
                            }).not(".hidden");
                            s.html(l.noMatch.replace(/\{0\}/g, t.ftxt.val())).toggle(!i.length), t.selAllState()
                        })
                    },
                    selAllState: function() {
                        var t = this;
                        if (l.selectAll) {
                            var i = 0,
                                s = 0;
                            t.optDiv.find("li.opt").not(".hidden").each(function(t, l) {
                                e(l).hasClass("selected") && i++, e(l).hasClass("disabled") || s++
                            }), i == s ? t.selAll.removeClass("partial").addClass("selected") : 0 == i ? t.selAll.removeClass("selected partial") : t.selAll.addClass("partial")
                        }
                    },
                    showOpts: function() {
                        var t = this;
                        t.E.attr("disabled") || (t.is_opened = !0, t.select.addClass("open"), t.ftxt ? t.ftxt.focus() : t.select.focus(), e(document).on("click.sumo", function(e) {
                            if (!t.select.is(e.target) && 0 === t.select.has(e.target).length) {
                                if (!t.is_opened) return;
                                t.hideOpts(), l.okCancelInMulti && t._cnbtn()
                            }
                        }), t.is_floating && (H = t.optDiv.children("ul").outerHeight() + 2, t.is_multi && t.is_multi_sigle_sel && (H += parseInt(t.optDiv.css("padding-bottom"))), t.optDiv.css("height", H), e("body").addClass("sumoStopScroll")), t.setPstate())
                    },
                    setPstate: function() {
                        var e = this;
                        e.is_multi && e.is_multi_sigle_sel && (e.is_floating || l.okCancelInMulti) && (e.Pstate = [], e.E.find("option").each(function(t, l) {
                            l.selected && e.Pstate.push(t)
                        }))
                    },
                    callChange: function() {
                        this.E.trigger("change").trigger("click")
                    },
                    hideOpts: function() {
                        var t = this;
                        t.is_opened && (t.is_opened = !1, t.select.removeClass("open").find("ul li.sel").removeClass("sel"), e(document).off("click.sumo"), t.select.focus(), e("body").removeClass("sumoStopScroll"), l.search && (t.ftxt.val(""), t.optDiv.find("ul.options li").removeClass("hidden"), t.optDiv.find(".no-match").toggle(!1)))
                    },
                    setOnOpen: function() {
                        var e = this,
                            t = e.optDiv.find("li.opt:not(.hidden)").eq(l.search ? 0 : e.E[0].selectedIndex);
                        e.optDiv.find("li.sel").removeClass("sel"), t.addClass("sel"), e.showOpts()
                    },
                    nav: function(e) {
                        var t, l = this,
                            i = l.ul.find("li.opt:not(.disabled, .hidden)"),
                            s = l.ul.find("li.opt.sel:not(.hidden)"),
                            n = i.index(s);
                        if (l.is_opened && s.length) {
                            if (e && n > 0) t = i.eq(n - 1);
                            else {
                                if (!(!e && n < i.length - 1 && n > -1)) return;
                                t = i.eq(n + 1)
                            }
                            s.removeClass("sel"), s = t.addClass("sel");
                            var o = l.ul,
                                a = o.scrollTop(),
                                c = s.position().top + a;
                            c >= a + o.height() - s.outerHeight() && o.scrollTop(c - o.height() + s.outerHeight()), a > c && o.scrollTop(c)
                        } else l.setOnOpen()
                    },
                    basicEvents: function() {
                        var t = this;
                        t.CaptionCont.click(function(e) {
                            t.E.trigger("click"), t.is_opened ? t.hideOpts() : t.showOpts(), e.stopPropagation()
                        }), t.select.on("keydown.sumo", function(e) {
                            switch (e.which) {
                                case 38:
                                    t.nav(!0);
                                    break;
                                case 40:
                                    t.nav(!1);
                                    break;
                                case 32:
                                    if (l.search && t.ftxt.is(e.target)) return;
                                case 13:
                                    t.is_opened ? t.optDiv.find("ul li.sel").trigger("click") : t.setOnOpen();
                                    break;
                                case 9:
                                case 27:
                                    return l.okCancelInMulti && t._cnbtn(), void t.hideOpts();
                                default:
                                    return
                            }
                            e.preventDefault()
                        }), e(window).on("resize.sumo", function() {
                            t.floatingList()
                        })
                    },
                    // onOptClick: function(t) {
                    //     var i = this;
                    //     t.click(function() {
                    //         var t = e(this);
                    //         t.hasClass("disabled") || (txt = "", i.is_multi ? (t.toggleClass("selected"), t.data("opt")[0].selected = t.hasClass("selected"), i.selAllState()) : (t.parent().find("li.selected").removeClass("selected"), t.toggleClass("selected"), t.data("opt")[0].selected = !0), i.is_multi && l.triggerChangeCombined && (i.is_floating || l.okCancelInMulti) || (i.setText(), i.callChange()), i.is_multi || i.hideOpts())
                    //     })
                    // },
                    onOptClick: function (li) {
                        var O = this;
                        li.click(function () {
                            var li = $(this);
                            if(li.hasClass('disabled'))return;
                            txt = "";
                            if (O.is_multi) {
                                li.toggleClass('selected');
                                li.data('opt')[0].selected = li.hasClass('selected');
                                O.selAllState();
                            }else if(O.is_multi_sigle_sel){
                              var isDeselect = li.hasClass('selected');
                              li.parent().find('li.selected').removeClass('selected'); //if not multiselect then remove all selections from this list
                              if(!isDeselect){
                                  li.toggleClass('selected');
                              }
                              li.data('opt')[0].selected = true;
                            }
                            else {
                                li.parent().find('li.selected').removeClass('selected'); //if not multiselect then remove all selections from this list
                                li.toggleClass('selected');
                                li.data('opt')[0].selected = true;
                            }
                            //branch for combined change event.
                            if (!(O.is_multi && O.is_multi_sigle_sel && settings.triggerChangeCombined && (O.is_floating || settings.okCancelInMulti))) {
                                O.setText();
                                O.callChange();
                            }

                            if (!O.is_multi) O.hideOpts(); //if its not a multiselect then hide on single select.
                        });
                    },
                    // setText: function() {
                    //     var t = this;
                    //     if (t.placeholder = "", t.is_multi) {
                    //         for (sels = t.E.find(":selected").not(":disabled"), i = 0; i < sels.length; i++) {
                    //             if (i + 1 >= l.csvDispCount && l.csvDispCount) {
                    //                 sels.length == t.E.find("option").length && l.captionFormatAllSelected ? t.placeholder = l.captionFormatAllSelected.replace(/\{0\}/g, sels.length) + "," : t.placeholder = l.captionFormat.replace(/\{0\}/g, sels.length) + ",";
                    //                 break
                    //             }
                    //             t.placeholder += e(sels[i]).text() + ", "
                    //         }
                    //         t.placeholder = t.placeholder.replace(/,([^,]*)$/, "$1")
                    //     } else t.placeholder = t.E.find(":selected").not(":disabled").text();
                    //     return is_placeholder = !1, t.placeholder || (is_placeholder = !0, t.placeholder = t.E.attr("placeholder"), t.placeholder || (t.placeholder = t.E.find("option:disabled:selected").text())), t.placeholder = t.placeholder ? l.prefix + " " + t.placeholder : l.placeholder, t.caption.html(t.placeholder), t.CaptionCont.attr("title", t.placeholder), csvField = t.select.find("input.HEMANT123"), csvField.length && csvField.val(t.getSelStr()), is_placeholder ? t.caption.addClass("placeholder") : t.caption.removeClass("placeholder"), t.placeholder
                    // },
                    setText: function () {
                        var O = this;
                        O.placeholder = "";
                        if (O.is_multi) {
                            sels = O.E.find(':selected').not(':disabled'); //selected options.

                            for (i = 0; i < sels.length; i++) {
                                    if (i + 1 >= settings.csvDispCount && settings.csvDispCount) {
                                        if (sels.length == O.E.find('option').length && settings.captionFormatAllSelected) {
                                            O.placeholder = settings.captionFormatAllSelected.replace(/\{0\}/g, sels.length)+',';
                                        } else {
                                            O.placeholder = settings.captionFormat.replace(/\{0\}/g, sels.length)+',';
                                        }

                                        break;
                                    }
                                    else O.placeholder += $(sels[i]).text() + ", ";
                                }
                                O.placeholder = O.placeholder.replace(/,([^,]*)$/, '$1'); //remove unexpected "," from last.
                        }else if(O.is_multi_sigle_sel){
                          O.placeholder = li.parent().find('li.selected').text();
                          O.placeholder = O.placeholder.replace(/,([^,]*)$/, '$1'); //remove unexpected "," from last.
                        }
                        else {
                            O.placeholder = O.E.find(':selected').not(':disabled').text();
                        }

                        is_placeholder = false;

                        if (!O.placeholder) {

                            is_placeholder = true;

                            O.placeholder = O.E.attr('placeholder');
                            if (!O.placeholder)                  //if placeholder is there then set it
                                O.placeholder = O.E.find('option:disabled:selected').text();
                        }

                        O.placeholder = O.placeholder ? (settings.prefix + ' ' + O.placeholder) : settings.placeholder

                        //set display text
                        O.caption.html(O.placeholder);
                        O.CaptionCont.attr('title', O.placeholder);

                        //set the hidden field if post as csv is true.
                        csvField = O.select.find('input.HEMANT123');
                        if (csvField.length) csvField.val(O.getSelStr());

                        //add class placeholder if its a placeholder text.
                        if (is_placeholder) O.caption.addClass('placeholder'); else O.caption.removeClass('placeholder');
                        return O.placeholder;
                    },
                    isMobile: function() {
                        for (var e = navigator.userAgent || navigator.vendor || window.opera, t = 0; t < l.nativeOnDevice.length; t++)
                            if (e.toString().toLowerCase().indexOf(l.nativeOnDevice[t].toLowerCase()) > 0) return l.nativeOnDevice[t];
                        return !1
                    },
                    setNativeMobile: function() {
                        var e = this;
                        e.E.addClass("SelectClass"), e.mob = !0, e.E.change(function() {
                            e.setText()
                        })
                    },
                    floatingList: function() {
                        var t = this;
                        t.is_floating = e(window).width() <= l.floatWidth, t.optDiv.toggleClass("isFloating", t.is_floating), t.is_floating || t.optDiv.css("height", ""), t.optDiv.toggleClass("okCancelInMulti", l.okCancelInMulti && !t.is_floating)
                    },
                    vRange: function(e) {
                        var t = this;
                        if (opts = t.E.find("option"), opts.length <= e || 0 > e) throw "index out of bounds";
                        return t
                    },
                    toggSel: function(t, l) {
                        var i = this;
                        "number" == typeof l ? (i.vRange(l), opt = i.E.find("option")[l]) : opt = i.E.find('option[value="' + l + '"]')[0] || 0, opt && !opt.disabled && opt.selected != t && (opt.selected = t, i.mob || e(opt).data("li").toggleClass("selected", t), i.callChange(), i.setPstate(), i.setText(), i.selAllState())
                    },
                    toggDis: function(e, t) {
                        var l = this.vRange(t);
                        l.E.find("option")[t].disabled = e, e && (l.E.find("option")[t].selected = !1), l.mob || l.optDiv.find("ul.options li").eq(t).toggleClass("disabled", e).removeClass("selected"), l.setText()
                    },
                    toggSumo: function(e) {
                        var t = this;
                        return t.enabled = e, t.select.toggleClass("disabled", e), e ? (t.E.attr("disabled", "disabled"), t.select.removeAttr("tabindex")) : (t.E.removeAttr("disabled"), t.select.attr("tabindex", "0")), t
                    },
                    toggSelAll: function(t) {
                        var l = this;
                        l.E.find("option").each(function() {
                            l.E.find("option")[e(this).index()].disabled || (l.E.find("option")[e(this).index()].selected = t, l.mob || l.optDiv.find("ul.options li").eq(e(this).index()).toggleClass("selected", t), l.setText())
                        }), !l.mob && l.selAll && l.selAll.removeClass("partial").toggleClass("selected", t), l.callChange(), l.setPstate()
                    },
                    reload: function() {
                        var t = this.unload();
                        return e(t).SumoSelect(l)
                    },
                    unload: function() {
                        var e = this;
                        return e.select.before(e.E), e.E.show(), l.outputAsCSV && e.is_multi && e.select.find("input.HEMANT123").length && e.E.attr("name", e.select.find("input.HEMANT123").attr("name")), e.select.remove(), delete t.sumo, t
                    },
                    add: function(l, i, s) {
                        if ("undefined" == typeof l) throw "No value to add";
                        var n = this;
                        if (opts = n.E.find("option"), "number" == typeof i && (s = i, i = l), "undefined" == typeof i && (i = l), opt = e("<option></option>").val(l).html(i), opts.length < s) throw "index out of bounds";
                        return "undefined" == typeof s || opts.length == s ? (n.E.append(opt), n.mob || n.ul.append(n.createLi(opt))) : (opts.eq(s).before(opt), n.mob || n.ul.find("li.opt").eq(s).before(n.createLi(opt))), t
                    },
                    remove: function(e) {
                        var t = this.vRange(e);
                        t.E.find("option").eq(e).remove(), t.mob || t.optDiv.find("ul.options li").eq(e).remove(), t.setText()
                    },
                    selectItem: function(e) {
                        this.toggSel(!0, e)
                    },
                    unSelectItem: function(e) {
                        this.toggSel(!1, e)
                    },
                    selectAll: function() {
                        this.toggSelAll(!0)
                    },
                    unSelectAll: function() {
                        this.toggSelAll(!1)
                    },
                    disableItem: function(e) {
                        this.toggDis(!0, e)
                    },
                    enableItem: function(e) {
                        this.toggDis(!1, e)
                    },
                    enabled: !0,
                    enable: function() {
                        return this.toggSumo(!1)
                    },
                    disable: function() {
                        return this.toggSumo(!0)
                    },
                    init: function() {
                        var e = this;
                        return e.createElems(), e.setText(), e
                    }
                }, t.sumo.init())
            });
        return 1 == s.length ? s[0] : s
    }
}(jQuery);
