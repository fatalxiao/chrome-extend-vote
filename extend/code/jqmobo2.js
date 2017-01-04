var curField = null;
var relationHT = new Array();
var relationQs = new Object();
var relationNotDisplayQ = new Object();
function setCookie(b, d, a, f, c, e) {
	document.cookie = b + "=" + escape(d) + ((a) ? "; expires=" + a : "") + ((f) ? "; path=" + f : "") + ((c) ? "; domain=" + c : "") + ((e) ? "; secure" : "");
}
var spChars = ["$", "}", "^", "|", "<"];
var spToChars = ["ξ", "｝", "?", "?", "&lt;"];
function replace_specialChar(c) {
	for (var a = 0; a < spChars.length; a++) {
		var b = new RegExp("(\\" + spChars[a] + ")", "g");
		c = c.replace(b, spToChars[a]);
	}
	return c;
}
String.prototype.format = function () {
	var a = arguments;
	return this.replace(/\{(\d+)\}/g, function (b, c) {
		return a[c];
	});
};
var curfilediv = null;
var isUploadingFile = false;
var cur_page = 0;
var hasSkipPage = false;
var prevControl = null;
var pageHolder = null;
var curMatrixFill = null;
var curMatrixError = null;
var imgVerify = null;
var questionsObject = new Object();
function setMatrixFill() {
	if (curMatrixError && !curMatrixFill.fillvalue) {
		return;
	}
	$("#divMatrixRel").hide();
}
function showMatrixFill(e, b) {
	if (b) {
		if (curMatrixError) {
			return;
		}
		curMatrixError = e;
	}
	curMatrixFill = e;
	if (e.holder) {
		$("#matrixinput").attr("placeholder", "请注明选择[" + e.holder + "]的原因...");
	}
	var d = e.fillvalue || "";
	$("#matrixinput").val(d);
	var a = $(e).attr("req");
	var f = $(e).offset();
	var c = f.top - $(e).height() - 15;
	$("#divMatrixRel").css("top", c + "px").css("left", "0").show();
}
function refresh_validate() {
	if (imgCode && tCode.style.display != "none" && imgCode.style.display != "none") {
		imgCode.src = "/AntiSpamImageGen.aspx?q=" + activityId + "&t=" + (new Date()).valueOf();
	}
	if (submit_text) {
		submit_text.value = "";
	}
	if (imgVerify) {
		imgVerify.onclick();
	}
}
$(function () {
	pageHolder = $("fieldset.fieldset");
	for (var j = 0; j < pageHolder.length; j++) {
		var p = $(pageHolder[j]).attr("skip") == "true";
		if (p) {
			pageHolder[j].skipPage = true;
			hasSkipPage = true;
		}
		var o = $(".field", pageHolder[j]);
		var d = 0;
		for (var l = 0; l < o.length; l++) {
			o[l].indexInPage = d;
			if (hasSkipPage) {
				o[l].pageParent = pageHolder[j];
			}
			d++;
		}
	}
	$("#divMatrixRel").bind("click", function (k) {
		k.stopPropagation();
	});
	$(document).bind("click", function () {
		setMatrixFill();
	});
	$("#matrixinput").on("keyup blur focus", function () {
		if (curMatrixFill) {
			var k = $("#matrixinput").val();
			curMatrixFill.fillvalue = k;
		}
	});
	$("input[type='text']").focus(function () {
		$(this.parentNode).addClass("ui-focus");
	});
	$("input[type='text']").blur(function () {
		$(this.parentNode).removeClass("ui-focus");
	});
	$("input").bind("click", function (q) {
		var k = $(this).parents(".field")[0];
		if (window.isWeiXin && prevControl && prevControl != this && ($(prevControl).is("textarea") || $(prevControl).is("input:text"))) {
			$(prevControl).blur();
		}
		prevControl = this;
		if (k && k.removeError) {
			k.removeError();
		}
		q.preventDefault();
	});
	var n = false;
	var h = new Array();
	$(".field").each(function () {
		var r = $(this);
		r.bind("click", function () {
			if (this.removeError) {
				this.removeError();
			}
			if (window.scrollup) {
				scrollup.Stop();
			}
		});
		var z = r.attr("type");
		var y = getTopic(r);
		questionsObject[y] = r;
		var q = r.attr("relation");
		if (q && q != "0") {
			var k = q.split(",");
			var t = k[0];
			var B = k[1].split(";");
			for (var v = 0; v < B.length; v++) {
				var A = t + "," + B[v];
				if (!relationHT[A]) {
					relationHT[A] = new Array();
				}
				relationHT[A].push(this);
			}
			if (!relationQs[t]) {
				relationQs[t] = new Array();
			}
			relationQs[t].push(this);
			relationNotDisplayQ[y] = "1";
		} else {
			if (q == "0") {
				relationNotDisplayQ[y] = "1";
			}
		}
		if (r.attr("hrq") == "1") {
			return true;
		}
		if (z == "1") {
			var x = $("input:text", r);
			x.on("keyup blur click", function () {
				verifyTxt(r, x);
				window.hasAnswer = true;
				jump(r, this);
			});
			var u = $("textarea", r);
			if (u[0]) {
				var s = u.prev("a")[0];
				s.par = r[0];
				u[0].par = r[0];
				r[0].needsms = true;
				var w = u.parents("div").find(".phonemsg")[0];
				r[0].mobileinput = x[0];
				r[0].verifycodeinput = u[0];
				s.onclick = function () {
					if (this.disabled) {
						return;
					}
					var G = this.par;
					if (G.issmsvalid && G.mobile == G.mobileinput.value) {
						return;
					}
					this.disabled = true;
					var F = "/Handler/AnswerSmsHandler.ashx?q=" + activityId + "&mob=" + escape(G.mobileinput.value) + "&t=" + (new Date()).valueOf();
					$.ajax({
						type: "GET", url: F, async: false, success: function (I) {
							var J = "";
							if (I == "true") {
								J = "成功发送验证码";
							} else {
								if (I == "fast") {
									J = "发送频率过快";
								} else {
									if (I == "many") {
										J = "发送验证码次数过多";
									} else {
										if (I == "no") {
											J = "发布者短信数量不够";
										} else {
											if (I == "fail") {
												J = "短信发送失败";
											} else {
												if (I == "error") {
													J = "手机号码不正确";
												} else {
													if (I == "nopub") {
														J = "问卷还未发布";
													}
												}
											}
										}
									}
								}
							}
							w.innerHTML = J;
						}
					});
					var E = this;
					var D = 60;
					var H = setInterval(function () {
						D--;
						if (D > 0) {
							E.innerHTML = "重新发送(" + D + ")";
						} else {
							E.innerHTML = "发送验证短信";
							E.disabled = false;
							clearInterval(H);
						}
					}, 1000);
				};
				u[0].onchange = u[0].onblur = function () {
					var F = this.value;
					if (F.length != 6) {
						return;
					}
					if (!/^(\-)?\d+$/.exec(F)) {
						return;
					}
					var E = this.par;
					if (E.issmsvalid && E.mobile == E.mobileinput.value) {
						return;
					}
					if (E.prevcode == F) {
						return;
					}
					var D = "/Handler/AnswerSmsValidateHandler.ashx?q=" + activityId + "&mob=" + escape(E.mobileinput.value) + "&code=" + escape(this.value) + "&t=" + (new Date()).valueOf();
					$.ajax({
						type: "GET", url: D, async: false, success: function (G) {
							E.issmsvalid = false;
							var H = "";
							E.prevcode = F;
							if (G == "true") {
								E.issmsvalid = true;
								E.mobile = E.mobileinput.value;
								H = "成功通过验证";
							} else {
								if (G == "send") {
									H = "请先发送验证码";
								} else {
									if (G == "no") {
										H = "验证码输入错误超过5次，无法再提交";
									} else {
										if (G == "error") {
											H = "验证码输入错误";
										}
									}
								}
							}
							w.innerHTML = H;
						}
					});
				};
			}
		} else {
			if (z == "2") {
				var x = $("textarea", r);
				x.on("keyup blur click", function () {
					verifyTxt(r, x);
					window.hasAnswer = true;
					jump(r, this);
				});
			} else {
				if (z == "9") {
					$("input", r).on("keyup blur", function () {
						var D = $(this);
						msg = verifyTxt(r, $(this), true);
						jump(r, this);
					});
				} else {
					if (z == "8") {
						$("input", r).change(function () {
							jump(r, this);
						});
					} else {
						if (z == "12") {
							$("input", r).change(function () {
								var D = null;
								var G = $(r).attr("total");
								var H = $("input:visible", r);
								var E = count = H.length;
								var I = G;
								H.each(function (J) {
									if (J == E - 1) {
										D = this;
									}
									if ($(this).val()) {
										count--;
										I = I - $(this).val();
									}
								});
								if (count == 1 && D && I > 0) {
									$(D).val(I).change();
									I = 0;
								}
								msg = "";
								if (I != 0 && count == 0) {
									var F = parseInt($(D).val()) + I;
									if (F > 0 && D != this) {
										$(D).val(F).change();
										I = 0;
									} else {
										msg = "，<span style='color:red;'>" + sum_warn + "</span>";
									}
								}
								if (I == 0) {
									H.each(function (J) {
										if (!$(this).val()) {
											$(this).val("0").change();
										}
									});
								}
								$(".relsum", r).html(sum_total + "<b>" + G + "</b>" + sum_left + "<span style='color:red;font-bold:true;'>" + (G - I) + "</span>" + msg);
								jump(r, this);
							});
						} else {
							if (z == "13") {
								n = true;
							} else {
								if (z == "3") {
									$("div.ui-radio", r).bind("click", function (E) {
										var D = $(this).find("input[type='radio']")[0];
										if (D.disabled) {
											return;
										}
										window.hasAnswer = true;
										$(r).find("div.ui-radio").each(function () {
											$(this).find("input[type='radio']")[0].checked = false;
											$(this).find("a.jqradio").removeClass("jqchecked");
											$(this).removeClass("focuschoice");
										});
										D.checked = true;
										$(this).find("a.jqradio").addClass("jqchecked");
										$(this).addClass("focuschoice");
										displayRelationByType(r, "input[type=radio]", 1);
										jump(r, D);
										E.preventDefault();
									});
									var C = r.attr("qingjing");
									if (C) {
										h.push(r);
									}
								} else {
									if (z == "7") {
										$("select", r).bind("change", function (D) {
											$(this).parents(".ui-select").find("span").html(this.options[this.selectedIndex].text);
											displayRelationByType(r, "option", 5);
											jump(r, this.options[this.selectedIndex]);
											D.preventDefault();
										});
									} else {
										if (z == "10") {
											$("select", r).bind("change", function () {
												$(this).parents(".ui-select").find("span").html(this.options[this.selectedIndex].text);
												jump(r, this);
											});
											$("input", r).change(function () {
												var H = $(this);
												var G = H.val();
												var F = H.attr("isdigit") == "1";
												if (F) {
													if (parseFloat(G) != G) {
														H.val("");
													} else {
														var E = H.attr("min");
														if (E && G - E < 0) {
															H.val("");
														}
														var D = H.attr("max");
														if (D && G - D > 0) {
															H.val("");
														}
													}
												}
												jump(r, this);
											});
										} else {
											if (z == "5") {
												initRate(r);
												$("a.rate-off", r).bind("click", function () {
													displayRelationByType(r, "a.rate-off", 4);
													jump(r, this);
												});
											} else {
												if (z == "6") {
													initRate(r);
													$("a.rate-off", r).bind("click", function () {
														jump(r, this);
													});
												} else {
													if (z == "4") {
														$("div.ui-checkbox", r).bind("click", function (E) {
															var D = $(this).find("input[type='checkbox']")[0];
															if (D.disabled) {
																return;
															}
															D.checked = !D.checked;
															window.hasAnswer = true;
															if (D.checked) {
																$(this).find("a.jqcheck").addClass("jqchecked");
																$(this).addClass("focuschoice");
															} else {
																$(this).find("a.jqcheck").removeClass("jqchecked");
																$(this).removeClass("focuschoice");
															}
															checkHuChi(r, this);
															displayRelationByType(r, "input[type='checkbox']", 2);
															verifyCheckMinMax(r, false, false, this);
															jump(r, D);
															if (window.createItem) {
																createItem(r);
															}
															E.preventDefault();
														});
													} else {
														if (z == "21") {
															$(".shop-item", r).each(function () {
																var D = $(".itemnum", this);
																var E = $(".item_left", this);
																$(".add", this).bind("click", function (G) {
																	var J = false;
																	var F = 0;
																	if (E[0]) {
																		J = true;
																		F = parseInt(E.attr("num"));
																	}
																	var I = parseInt(D.val());
																	if (J && I >= F) {
																		var H = "库存只剩" + F + "件，不能再增加！";
																		if (F <= 0) {
																			H = "已售完，无法添加";
																		}
																		alert(H);
																	} else {
																		D.val(I + 1);
																		updateCart();
																	}
																	G.preventDefault();
																});
																$(".remove", this).bind("click", function (F) {
																	var G = parseInt(D.val());
																	if (G > 0) {
																		D.val(G - 1);
																		updateCart();
																	}
																	F.preventDefault();
																});
															});
														} else {
															if (z == "11") {
																$("li.ui-li-static", r).bind("click", function (E) {
																	if (!$(this).attr("check")) {
																		var D = $(this).parents("ul.ui-listview").find("li[check='1']").length + 1;
																		$(this).find("span.sortnum").html(D).addClass("sortnum-sel");
																		$(this).attr("check", "1");
																	} else {
																		var D = $(this).find("span").html();
																		$(this).parents("ul.ui-listview").find("li[check='1']").each(function () {
																			var F = $(this).find("span.sortnum").html();
																			if (F - D > 0) {
																				$(this).find("span.sortnum").html(F - 1);
																			}
																		});
																		$(this).find("span.sortnum").html("").removeClass("sortnum-sel");
																		$(this).attr("check", "");
																	}
																	displayRelationByType(r, "li.ui-li-static", 3);
																	verifyCheckMinMax(r, false, true, this);
																	jump(r, this);
																	if (window.createItem) {
																		createItem(r, true);
																	}
																	E.preventDefault();
																});
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	});
	for (var c = 0; c < h.length; c++) {
		var g = h[c];
		displayRelationByType(g, "input[type=radio]", 1);
	}
	$("#ctlNext") != null && $("#ctlNext").on("click", function () {
		if (this.disabled) {
			return;
		}
		if (window.divTip) {
			alert(divTip.innerHTML);
			return;
		}
		$("#action").val("1");
		var k = validate();
		if (!k) {
			return;
		}
		if (window.isDianChu) {
			if (!is_dianchecked) {
				$(".ValError").html("请按提示点击验证码");
				tou_submit.call(this);
				return;
			}
		} else {
			if (tCode && tCode.style.display != "none" && (submit_text.value == "" || submit_text.value == validate_info_submit_title3)) {
				try {
					submit_text.focus();
					submit_text.click();
				} catch (q) {
				}
				alert(validate_info_submit1);
				return;
			}
		}
		groupAnswer(1);
	});
	$("input.OtherText").bind("click", function (t) {
		var k = $(this).attr("rel");
		var q = $("#" + k)[0];
		q.checked = true;
		var r = $("#" + k).parents(".ui-checkbox");
		r.find("a.jqcheck").addClass("jqchecked");
		r.addClass("focuschoice");
		var s = $(this).parents("div.field");
		displayRelationByType(s, "input[type=checkbox]", 2);
		jump(s, q);
		verifyCheckMinMax(s, false);
		if (window.createItem) {
			createItem(s);
		}
		t.stopPropagation();
		t.preventDefault();
	});
	$("input.OtherText").each(function () {
		$(this).val().length > 0 && $(this).blur();
	});
	$("input.OtherRadioText").bind("click", function (t) {
		$(this).parents("div.ui-controlgroup").find("div.ui-radio").each(function () {
			$(this).find("input[type='radio']")[0].checked = false;
			$(this).find("a.jqradio").removeClass("jqchecked");
		});
		var k = $(this).attr("rel");
		var r = $("#" + k)[0];
		r.checked = true;
		var q = $("#" + k).parents(".ui-radio");
		q.find("a.jqradio").addClass("jqchecked");
		q.addClass("focuschoice");
		var s = $(this).parents("div.field");
		displayRelationByType(s, "input[type=radio]", 1);
		jump(s, r);
		t.stopPropagation();
		t.preventDefault();
	});
	$("input.OtherRadioText").each(function () {
		$(this).val().length > 0 && $(this).blur();
	});
	setVerifyCode();
	initSlider();
	if (totalPage > 1) {
		$("#divSubmit").hide();
		$("#divNext")[0].style.display = "";
		showProgress();
	} else {
		$("#divSubmit").show();
	}
	if (window.hasPageTime) {
		processMinMax();
	}
	fixBottom();
	$(window).load(function () {
		fixBottom();
	});
	if (window.hasPopUp) {
		$(".open-popup-link").magnificPopup({type: "inline", closeOnContentClick: true});
		$(".open-popup-link").click(function (k) {
			k.stopPropagation();
		});
	}
	if (window.cepingCandidate) {
		var e = cepingCandidate.split(",");
		var b = new Object();
		for (var a = 0; a < e.length; a++) {
			var f = e[a].replace(/(\s*)/g, "").replace("&", "");
			b[f] = "1";
		}
		var m = $("#div1");
		$("input[type=checkbox]", m).each(function () {
			var r = $(this).parents(".ui-checkbox");
			var q = r.find("label")[0];
			if (!q) {
				return true;
			}
			var k = q.innerHTML;
			k = k.replace(/(\s*)/g, "").replace("&amp;", "");
			if (b[k]) {
				r.trigger("click");
			}
		});
		m[0].style.display = "none";
		m[0].isCepingQ = "1";
	}
});
function initRate(a) {
	$("a.rate-off", a).bind("click", function (g) {
		var b = $(this).parents("div.field");
		var d = $(b).attr("ischeck");
		if (d) {
			$(this).toggleClass("rate-on");
			$(this).trigger("change");
		} else {
			$(this).parents("tr").find("a.rate-off").removeClass("rate-on");
			$(this).toggleClass("rate-on");
			$(this).trigger("change");
		}
		if ($(this).hasClass("rate-on")) {
			var c = $(this).attr("needfill");
			if (c) {
				if (!this.holder) {
					var j = $(".matrix-rating tr", b)[0];
					var h = $("th", $(j));
					var f = $(this).attr("dval");
					if (f && h[f - 1]) {
						this.holder = $(h[f - 1]).html();
					}
				}
				showMatrixFill(this);
				g.stopPropagation();
			}
		}
		$("span.error", $(b)).is(":visible") && validateQ(b);
		g.preventDefault();
	});
}
function updateCart() {
	var c = $("#divQuestion");
	var a = "";
	var b = 0;
	$(".shop-item", c).each(function () {
		var e = $(".itemnum", this);
		var h = parseInt(e.val());
		if (h == 0) {
			return true;
		}
		var j = $(".item_name", this).html();
		var f = $(".item_price", this).attr("price");
		var g = h * parseFloat(f).toFixed(2);
		var d = '<li class="productitem"><span class="fpname">' + j + '</span><span class="fpnum">' + h + '</span><span class="fpprice">￥' + g + "</span></li>";
		a += d;
		b += g;
	});
	a = "<ul class='productslist'>" + a + '</ul><div class="ftotalprice"><span class="priceshow">￥' + b.toFixed(2) + "</span></div>";
	$("#shopcart").html(a);
	if (b > 0) {
		$("#shopcart").show();
	} else {
		$("#shopcart").hide();
	}
}
function setVerifyCode() {
	if (tCode && tCode.style.display != "none") {
		submit_text.value = validate_info_submit_title3;
		submit_text.onblur = function () {
			if (submit_text.value == "") {
				submit_text.value = validate_info_submit_title3;
			}
		};
		submit_text.onfocus = function () {
			if (submit_text.value == validate_info_submit_title3) {
				submit_text.value = "";
			}
		};
		imgCode.style.display = "none";
		if (window.isDianChu) {
			tCode.style.display = "none";
			return;
		}
		submit_text.onclick = function () {
			if (!needAvoidCrack && imgCode.style.display == "none") {
				imgCode.style.display = "";
				imgCode.onclick = refresh_validate;
				imgCode.onclick();
				imgCode.title = validate_info_submit_title1;
			} else {
				if (needAvoidCrack && !imgVerify) {
					var c = $("#divCaptcha")[0];
					c.style.display = "";
					imgVerify = c.getElementsByTagName("img")[0];
					imgVerify.style.cursor = "pointer";
					imgVerify.onclick = function () {
						var h = new Date();
						var e = h.getTime() + (h.getTimezoneOffset() * 60000);
						var f = window.location.host || "www.sojump.com";
						var g = "http://" + f + "/BotDetectCaptcha.ashx?activity=" + activityId + "&get=image&c=" + this.captchaId + "&t=" + this.instanceId + "&d=" + e;
						this.src = g;
					};
					var a = imgVerify.getAttribute("captchaid");
					var b = imgVerify.getAttribute("instanceid");
					imgVerify.captchaId = a;
					imgVerify.instanceId = b;
					imgVerify.onclick();
				}
			}
		};
	}
}
function fixBottom() {
	var a = $("body").height() - $(window).height();
	if (a < 0) {
		$(".logofooter").addClass("fixedbottom");
	} else {
		$(".logofooter").removeClass("fixedbottom");
	}
}
var firstError = null;
var firstMatrixError = null;
function validate() {
	var b = true;
	firstError = null;
	firstMatrixError = null;
	curMatrixError = null;
	$(".field:visible").each(function () {
		var e = pageHolder[cur_page].hasExceedTime;
		if (e) {
			return true;
		}
		var d = $(this), a = validateQ(d);
		if (!a) {
			b = false;
		}
	});
	if (!b) {
		if (firstError) {
			$("html, body").animate({scrollTop: $(firstError).offset().top}, 600);
			$(".scrolltop").show();
			$(".scrolltop").click(function () {
				$("html, body").animate({scrollTop: $(document).height()}, 600);
				$(".scrolltop").hide();
			});
		}
	} else {
	}
	return b;
}
var txtCurCity = null;
function openCityBox(f, e, c, g) {
	txtCurCity = f;
	var d = "";
	g = g || "";
	if (e == 3) {
		var a = f.getAttribute("province");
		var b = "";
		if (a) {
			b = "&pv=" + encodeURIComponent(a);
		}
		d = "/wjx/design/setcitycountymobo2.aspx?activityid=" + activityId + "&ct=" + e + b + "&pos=" + g;
	} else {
		if (e == 5) {
			d = "/wjx/design/setmenusel.aspx?activityid=" + activityId + "&ct=" + e + "&pos=" + g;
		} else {
			d = "/wjx/design/setcitymobo2.aspx?activityid=" + activityId + "&ct=" + e + "&pos=" + g;
		}
	}
	$("#lnkCity")[0].href = d;
	$("#lnkCity").magnificPopup({type: "iframe"});
	$("#lnkCity").click();
}
function setCityBox(a) {
	txtCurCity.value = a;
	$.magnificPopup.close();
}
var startAge = 0;
var endAge = 0;
var rName = "";
function getRname(c, b) {
	if (rName) {
		return;
	}
	if (c != "1") {
		return;
	}
	var d = $("div.field-label", b).html();
	if (d.indexOf("姓名") == -1) {
		return;
	}
	rName = $("input:text", b).val();
}
function getAge(c, b) {
	if (c != "3" && c != "7") {
		return;
	}
	var h = $("div.field-label", b).html();
	if (h.indexOf("年龄") == -1) {
		return;
	}
	var e = "";
	var g = 0;
	if (c == 3) {
		$("input[type='radio']", b).each(function (a) {
			if (this.checked) {
				e = $(this).parents("div.ui-radio").find("label").html();
				g = a;
				return false;
			}
		});
	} else {
		if (c == 7) {
			var d = $("select", b)[0];
			e = d.options[d.selectedIndex].text;
			g = d.selectedIndex - 1;
		}
	}
	if (!e) {
		return;
	}
	var f = /[1-9][0-9]*/g;
	var j = e.match(f);
	if (!j || j.length == 0) {
		return;
	}
	if (j.length > 2) {
		return;
	}
	if (j.length == 2) {
		startAge = j[0];
		endAge = j[1];
	} else {
		if (j.length == 1) {
			if (g == 0) {
				endAge = j[0];
			} else {
				startAge = j[0];
			}
		}
	}
}
function groupAnswer(l) {
	var f = new Array();
	var k = 0;
	$(".field").each(function () {
		var s = $(this);
		var y = new Object();
		var w = s.attr("type");
		var t = this.style.display != "none";
		if (t && hasSkipPage) {
			if (this.pageParent && this.pageParent.skipPage) {
				t = false;
			}
		}
		if (this.isCepingQ) {
			t = true;
		}
		y._value = "";
		y._topic = getTopic(s);
		f[k++] = y;
		try {
			getAge(w, s);
			getRname(w, s);
		} catch (u) {
		}
		var x = 0;
		switch (w) {
			case"1":
				if (!t) {
					y._value = "(跳过)";
					if (s.attr("hrq") == "1") {
						y._value = "Ⅳ";
					}
					break;
				}
				y._value = replace_specialChar($("input:text", s).val());
				break;
			case"2":
				if (!t) {
					y._value = "(跳过)";
					if (s.attr("hrq") == "1") {
						y._value = "Ⅳ";
					}
					break;
				}
				y._value = replace_specialChar($("textarea", s).val());
				break;
			case"3":
				if (!t) {
					y._value = "-3";
					if (s.attr("hrq") == "1") {
						y._value = "-4";
					}
					break;
				}
				$("input[type='radio']:checked", s).each(function (A) {
					y._value = $(this).val();
					var z = $(this).attr("rel");
					if (z && $("#" + z).val().length > 0) {
						y._value += spChars[2] + replace_specialChar($("#" + z).val().substring(0, 3000));
					}
					return false;
				});
				break;
			case"4":
				if (!t) {
					y._value = "-3";
					if (s.attr("hrq") == "1") {
						y._value = "-4";
					}
					break;
				}
				var v = 0;
				$("input:checked", s).each(function () {
					var A = $(this).parents(".ui-checkbox")[0].style.display == "none";
					if (!A) {
						if (v > 0) {
							y._value += spChars[3];
						}
						y._value += $(this).val();
						var z = $(this).attr("rel");
						if (z && $("#" + z).val().length > 0) {
							y._value += spChars[2] + replace_specialChar($("#" + z).val().substring(0, 3000));
						}
						v++;
					}
				});
				if (v == 0) {
					y._value = "-2";
				}
				break;
			case"21":
				if (!t) {
					y._value = "-3";
					break;
				}
				var v = 0;
				$(".shop-item .itemnum", s).each(function (z) {
					var A = $(this).val();
					if (A != "0") {
						if (v > 0) {
							y._value += spChars[3];
						}
						y._value += (z + 1);
						y._value += spChars[2] + A;
						v++;
					}
				});
				if (v == 0) {
					y._value = "-2";
				}
				break;
			case"11":
				var e = new Array();
				$("li.ui-li-static", s).each(function () {
					var z = $(this).find("span.sortnum").html();
					var A = new Object();
					A.sIndex = z;
					var B = $(this).find("input:hidden").val();
					if (!t) {
						B = "-3";
					} else {
						if (!z) {
							B = "-2";
						}
					}
					A.val = B;
					if (!A.sIndex) {
						A.sIndex = 10000;
					}
					e.push(A);
				});
				e.sort(function (A, z) {
					return A.sIndex - z.sIndex;
				});
				for (var r = 0; r < e.length; r++) {
					if (r > 0) {
						y._value += ",";
					}
					y._value += e[r].val;
				}
				break;
			case"5":
				if (!t) {
					y._value = "-3";
					break;
				}
				y._value = $("input:hidden", s).val();
				break;
			case"6":
				x = 0;
				$("input:hidden", s).each(function (z) {
					if (x > 0) {
						y._value += ",";
					}
					var A = false;
					if (window.hasReferClient) {
						var B = $("tr[rv=" + (z + 1) + "]", s)[0];
						if (B && B.style.display == "none") {
							A = true;
						}
					}
					if (!t) {
						y._value += "-3";
					} else {
						var C = $(this).val();
						if (!C) {
							C = "-2";
						}
						if (A) {
							C = "-4";
						}
						y._value += C;
					}
					x++;
				});
				break;
			case"7":
				if (!t) {
					y._value = "-3";
					break;
				}
				y._value = $("select", s).val();
				break;
			case"8":
				if (!t) {
					y._value = "(跳过)";
					break;
				}
				y._value = $("input.ui-slider-input", s).val();
				break;
			case"9":
				x = 0;
				if (!t && s.attr("hrq") == "1") {
					y._value = "Ⅳ";
					break;
				}
				$("input", s).each(function () {
					if (x > 0) {
						y._value += spChars[2];
					}
					var B = $(this).val();
					var z = false;
					if (window.hasReferClient) {
						var A = $(this).parents("tr")[0];
						if (A && A.style.display == "none") {
							z = true;
						}
					}
					if (!t) {
						B = "(跳过)";
					} else {
						if (z) {
							B = "Ⅳ";
						}
					}
					y._value += replace_specialChar(B);
					x++;
				});
				break;
			case"12":
				x = 0;
				$("input", s).each(function () {
					if (x > 0) {
						y._value += spChars[2];
					}
					var z = false;
					if (window.hasReferClient) {
						var B = $(this).parents("tr")[0];
						if (B && B.style.display == "none") {
							z = true;
						}
					}
					var A = $(this).val();
					if (!t) {
						A = "(跳过)";
					} else {
						if (z) {
							A = "Ⅳ";
						}
					}
					y._value += A;
					x++;
				});
				break;
			case"13":
				if (!t) {
					y._value = "(跳过)";
					break;
				}
				y._value = this.fileName || "";
				break;
			case"10":
				x = 0;
				$("table", s).each(function () {
					if (x > 0) {
						y._value += spChars[2];
					}
					var z = 0;
					var C = "input";
					var B = "(跳过)";
					if (s.attr("select") == "1") {
						C = "select";
						B = "-3";
					}
					var A = false;
					if (window.hasReferClient) {
						var D = $(this).parents(".mdivtable")[0];
						if (D && D.style.display == "none") {
							A = true;
						}
					}
					$(C, this).each(function () {
						if (z > 0) {
							y._value += spChars[3];
						}
						var E = $(this).val();
						if (!t) {
							E = B;
						} else {
							if (A) {
								E = "Ⅳ";
							}
						}
						y._value += replace_specialChar(E);
						z++;
					});
					x++;
				});
				break;
		}
	});
	if (f.length == 0) {
		alert("提示：此问卷没有添加题目，不能提交！");
		return;
	}
	f.sort(function (r, e) {
		return r._topic - e._topic;
	});
	var p = "";
	for (i = 0; i < f.length; i++) {
		if (i > 0) {
			p += spChars[1];
		}
		p += f[i]._topic;
		p += spChars[0];
		p += f[i]._value;
	}
	var j = $("#form1").attr("action");
	if (j.indexOf("aliyun.sojump.com") > -1 || j.indexOf("temp.sojump.com") > -1) {
		j = j.replace("aliyun.sojump.com", window.location.host).replace("temp.sojump.com", window.location.host);
	}
	var g = j + "&starttime=" + encodeURIComponent($("#starttime").val());
	if (window.sojumpParm) {
		g += "&sojumpparm=" + encodeURIComponent(window.sojumpParm);
	}
	if (window.tparam) {
		g += "&tparam=1&sojumpparmext=" + encodeURIComponent(window.sojumpparmext);
	}
	if (window.Password) {
		g += "&psd=" + encodeURIComponent(Password);
	}
	if (window.hasMaxtime) {
		g += "&hmt=1";
	}
	if (tCode && tCode.style.display != "none" && submit_text.value != "") {
		g += "&validate_text=" + encodeURIComponent(submit_text.value);
	}
	if (window.isDianChu) {
		g += "&check_key=" + encodeURIComponent(check_key) + "&check_address=" + encodeURIComponent(check_address) + "&validate_text=dian";
	}
	if (window.cpid) {
		g += "&cpid=" + cpid;
	}
	if (window.guid) {
		g += "&emailguid=" + guid;
	}
	if (window.udsid) {
		g += "&udsid=" + window.udsid;
	}
	if (nvvv) {
		g += "&nvvv=1";
	}
	if (window.sjUser) {
		g += "&sjUser=" + encodeURIComponent(sjUser);
	}
	if (window.sourceurl) {
		g += "&source=" + encodeURIComponent(sourceurl);
	} else {
		g += "&source=directphone";
	}
	var n = window.alipayAccount || window.cAlipayAccount;
	if (n) {
		g += "&alac=" + encodeURIComponent(n);
	}
	if (window.SJBack) {
		g += "&sjback=1";
	}
	if (window.jiFen && jiFen > 0) {
		g += "&jf=" + jiFen;
	}
	if (l) {
		g += "&submittype=" + l;
	}
	if (l == 3) {
		g += "&zbp=" + (cur_page + 1);
	}
	if (window.rndnum) {
		g += "&rn=" + encodeURIComponent(rndnum);
	}
	if (imgVerify) {
		g += "&btuserinput=" + encodeURIComponent(submit_text.value);
		g += "&btcaptchaId=" + encodeURIComponent(imgVerify.captchaId);
		g += "&btinstanceId=" + encodeURIComponent(imgVerify.instanceId);
	}
	if (window.inviteid) {
		g += "&inviteid=" + encodeURIComponent(inviteid);
	}
	if (window.access_token) {
		g += "&access_token=" + encodeURIComponent(access_token) + "&openid=" + encodeURIComponent(openid);
	}
	if (window.wxthird) {
		g += "&wxthird=1";
	}
	if (window.isWeiXin) {
		g += "&iwx=1";
	}
	g += "&t=" + new Date().valueOf();
	if (window.cProvince) {
		g += "&cp=" + encodeURIComponent(cProvince.replace("'", "")) + "&cc=" + encodeURIComponent(cCity.replace("'", "")) + "&ci=" + escape(cIp);
		var c = cProvince + "," + cCity;
		var o = window.location.host || "sojump.com";
		try {
			setCookie("ip_" + cIp, c, null, "/", "", null);
		} catch (d) {
		}
	}
	$("#ctlNext").hide();
	var q = "处理中......";
	if (langVer == 1) {
		q = "Submiting......";
	}
	$(".ValError").html(q);
	if (l == 3) {
		$(".ValError").html("正在验证，请稍候...");
	}
	var m = {submitdata: p};
	var h = false;
	var b = window.getMaxWidth || 1800;
	var a = encodeURIComponent(p);
	if (window.submitWithGet && a.length <= b) {
		h = true;
	}
	if (h) {
		g += "&submitdata=" + a;
		g += "&useget=1";
	} else {
		if (window.submitWithGet) {
			window.postIframe = 1;
		}
	}
	if (window.postIframe) {
		postWithIframe(g, p);
	} else {
		if (h) {
			$.ajax({
				type: "GET", url: g, success: function (e) {
					afterSubmit(e, l);
				}, error: function () {
					$(".ValError").html("很抱歉，网络连接异常，请重新尝试提交！");
					$("#ctlNext").show();
					return;
				}
			});
		} else {
			$.ajax({
				type: "POST", url: g, data: m, dataType: "text", success: function (e) {
					afterSubmit(e, l);
				}
			});
		}
	}
}
function postWithIframe(b, c) {
	var a = document.createElement("div");
	a.style.display = "none";
	a.innerHTML = "<iframe id='mainframe' name='mainframe' style='display:none;' > </iframe><form target='mainframe' data-ajax='false' id='frameform' action='' method='post' enctype='application/x-www-form-urlencoded'><input  value='' id='submitdata' name='submitdata' type='hidden'><input type='submit' value='提交' ></form>";
	document.body.appendChild(a);
	document.getElementById("submitdata").value = c;
	var d = document.getElementById("frameform");
	d.action = b + "&iframe=1";
	d.submit();
}
var havereturn = false;
var timeoutTimer = null;
function processError(c, b, a) {
	if (!havereturn) {
		havereturn = true;
		$(".ValError").html("提交超时，请检查网络是否异常！");
		$("#ctlNext").show();
	}
	if (timeoutTimer) {
		clearTimeout(timeoutTimer);
	}
}
var nvvv = 0;
function afterSubmit(r, k) {
	$(".ValError").html("");
	havereturn = true;
	var m = r.split("〒");
	var g = m[0];
	if (g == 10) {
		var f = m[1];
		var n = f.replace("complete.aspx", "completemobile2.aspx").replace("?q=", "?activity=").replace("&joinid=", "&joinactivity=").replace("&JoinID=", "&joinactivity=");
		if (startAge) {
			n += "&sa=" + encodeURIComponent(startAge);
		}
		if (endAge) {
			n += "&ea=" + encodeURIComponent(endAge);
		}
		if (rName) {
			n += "&rname=" + encodeURIComponent(rName);
		}
		if (inviteid) {
			n += "&inviteid=" + encodeURIComponent(inviteid);
		}
		if (window.sourceurl) {
			n += "&source=" + encodeURIComponent(sourceurl);
		}
		if (window.sjUser) {
			n += "&sjUser=" + encodeURIComponent(sjUser);
		}
		if (window.needHideShare) {
			n += "&nhs=1";
		}
		if (!window.wxthird && window.access_token && window.hashb) {
			n += "&access_token=" + encodeURIComponent(access_token) + "&openid=" + encodeURIComponent(openid);
		}
		if (window.isWeiXin) {
			setCookie("join_" + activityId, "1", null, "/", "", null);
		}
		if ($("#shopcart")[0] && $("#shopcart")[0].style.display != "none") {
			n += "&ishop=1";
		}
		location.replace(n);
		return;
	} else {
		if (g == 11) {
			var l = m[1];
			if (!l) {
				l = window.location.href;
			} else {
				if (l.toLowerCase().indexOf("http://") == -1 && l.toLowerCase().indexOf("https://") == -1) {
					l = "http://" + l;
				}
			}
			var t = m[3] || "";
			var j = m[4] || "";
			var q = false;
			if (l.indexOf("{output}") > -1) {
				if (window.sojumpParm) {
					l = l.replace("{output}", window.sojumpParm);
				} else {
					if (j) {
						l = l.replace("{output}", j);
					}
				}
				q = true;
			}
			if (window.sojumpParm) {
				var h = t.split(",");
				var a = "sojumpindex=" + h[0];
				if (l.indexOf("?") > -1) {
					a = "&" + a;
				} else {
					a = "?" + a;
				}
				if (h[1]) {
					a += "&totalvalue=" + h[1];
				}
				if (l.toLowerCase().indexOf("sojumpparm=") == -1 && !q) {
					a += "&sojumpparm=" + window.sojumpParm;
				}
				l += a;
			}
			if (window.wxthird && window.openid) {
				if (l.indexOf("?") > -1) {
					l += "&openid=" + encodeURIComponent(openid);
				} else {
					l += "?openid=" + encodeURIComponent(openid);
				}
			}
			if (l.indexOf("www.sojump.com") > -1) {
				l = l.replace("/jq/", "/m/");
			}
			var p = m[2];
			if (p && window.jiFenBao == 0 && p != "不提示" && !window.sojumpParm) {
				$(".ValError").html(p);
			}
			setTimeout(function () {
				location.replace(l);
			}, 1000);
			return;
		} else {
			if (k == 3) {
				if (g == 12) {
					to_next_page();
					$("#ctlNext").show();
					return;
				} else {
					if (g == 13) {
						var d = m[1];
						var s = m[2] || "0";
						var f = "/wjx/join/completemobile2.aspx?activity=" + activityId + "&joinactivity=" + d;
						f += "&v=" + s;
						if (window.isWeiXin) {
							setCookie("join_" + activityId, "1", null, "/", "", null);
						}
						if (window.sjUser) {
							f += "&sjUser=" + encodeURIComponent(sjUser);
						}
						if (window.sourceurl) {
							f += "&source=" + encodeURIComponent(sourceurl);
						}
						location.replace(f);
						return;
					} else {
						if (g == 11) {
							return;
						} else {
							if (g == 5) {
								alert(m[1]);
								return;
							}
						}
					}
				}
			} else {
				if (g == 9 || g == 16 || g == 23) {
					var o = parseInt(m[1]);
					var c = (o + 1) + "";
					var e = m[2] || "您提交的数据有误，请检查！";
					if (g == 23 && e.indexOf("库存") == -1) {
						e = "很抱歉，由于问卷发布者设置了选项配额，您选择的选项配额已满，请重新选择！";
					}
					if (questionsObject[c]) {
						writeError(questionsObject[c], e, 3000);
						$(questionsObject[c])[0].scrollIntoView();
					}
					alert(e);
					$("#ctlNext").show();
				} else {
					if (g == 2) {
						alert(m[1]);
						$("#ctlNext").show();
					} else {
						if (g == 4) {
							alert(m[1]);
							$("#ctlNext").show();
							return;
						} else {
							if (g == 19 || g == 5) {
								alert(m[1]);
								$("#ctlNext").show();
								return;
							} else {
								if (g == 17) {
									alert("密码已经被其他人使用过！");
									return;
								} else {
									if (g == 22) {
										alert("提交有误，请输入验证码重新提交！");
										if (!needAvoidCrack) {
											tCode.style.display = "";
											imgCode.style.display = "";
											imgCode.onclick = refresh_validate;
											imgCode.onclick();
										}
										nvvv = 1;
										$("#ctlNext").show();
										return;
									} else {
										var b = m[1] || r;
										alert(b);
										$("#ctlNext").show();
									}
								}
							}
						}
					}
				}
			}
		}
	}
	refresh_validate();
}
function clearFieldValue(c) {
	var d = $(c).attr("type");
	if (d == "3") {
		$("input[type='radio']:checked", $(c)).each(function () {
			this.checked = false;
			$(this).parents(".ui-radio").find("a.jqradio").removeClass("jqchecked");
		});
		$("input.OtherRadioText", $(c)).each(function () {
			$(this).val("").blur();
		});
	} else {
		if (d == "4") {
			$("input:checked", $(c)).each(function () {
				this.checked = false;
				$(this).parents(".ui-checkbox").find("a.jqcheck").removeClass("jqchecked");
			});
		} else {
			if (d == "6") {
				$("a.rate-off", $(c)).each(function () {
					$(this).removeClass("rate-on");
				});
			} else {
				if (d == "5") {
					$("a.rate-off", $(c)).each(function () {
						$(this).removeClass("rate-on");
					});
				} else {
					if (d == "7") {
						if ($("select", $(c)).val() != "-2") {
							$("select", $(c)).val("-2").trigger("change");
						}
					} else {
						if (d == "8") {
							$("input", $(c)).val("").change();
						} else {
							if (d == "9") {
								$("input.ui-slider-input", $(c)).each(function () {
									$(this).val("").change();
								});
							} else {
								if (d == "11") {
									$("li.ui-li-static", $(c)).each(function () {
										$(this).find("span.sortnum").html("").removeClass("sortnum-sel");
										$(this).attr("check", "");
									});
								}
							}
						}
					}
				}
			}
		}
	}
}
function validateQ(n) {
	var g = $(n).attr("req"), k = $(n).attr("type"), m = true;
	var j = $(n)[0];
	var f = "";
	var e = $(n).attr("hasjump");
	if (k == "1") {
		var h = $("input:text", $(n));
		var d = $.trim(h.val());
		m = d.length == 0 ? false : true;
		f = verifyTxt(n, h);
	} else {
		if (k == "2") {
			var h = $("textarea", $(n));
			var d = $.trim(h.val());
			m = d.length == 0 ? false : true;
			f = verifyTxt(n, h);
		} else {
			if (k == "3") {
				m = false;
				$(n).find("input:checked").each(function () {
					m = true;
					var a = $(this).attr("rel");
					if (a) {
						var b = $("#" + a);
						if (b.attr("required") && b.val().length == 0) {
							f = "文本框内容必须填写！";
							writeError(n, f, 3000);
							return false;
						}
					}
				});
			} else {
				if (k == "4") {
					m = false;
					var o = false;
					$(n).find("input:checked").each(function () {
						m = true;
						var a = $(this).attr("rel");
						if (a) {
							var b = $("#" + a);
							if (b.attr("required") && b.val().length == 0) {
								f = "文本框内容必须填写！";
								b.focus();
								writeError(n, f, 3000);
								o = true;
								return false;
							}
						}
					});
					if (!o) {
						f = verifyCheckMinMax($(n), true);
					}
				} else {
					if (k == "11") {
						m = $("li.ui-li-static[check='1']", $(n)).length == 0 ? false : true;
						f = verifyCheckMinMax($(n), true, true);
					} else {
						if (k == "5") {
							m = validateScaleRating($(n));
						} else {
							if (k == "6") {
								m = validateMatrix($(n));
							} else {
								if (k == "7") {
									m = $("select", $(n))[0].selectedIndex == 0 ? false : true;
								} else {
									if (k == "8") {
										m = $("input", $(n)).val().length == 0 ? false : true;
									} else {
										if (k == "9") {
											$("input", $(n)).each(function () {
												var a = $(this);
												var c = a.val();
												if (window.hasReferClient) {
													var b = a.parents("tr")[0];
													if (b && b.style.display == "none") {
														return true;
													}
												}
												if (c.length == 0) {
													m = false;
												}
												f = verifyTxt(n, a, true);
												if (f) {
													return false;
												}
											});
										} else {
											if (k == "12") {
												var l = $(n).attr("total");
												var p = l;
												$("input", $(n)).each(function () {
													var a = $(this);
													if (window.hasReferClient) {
														var c = a.parents("tr")[0];
														if (c && c.style.display == "none") {
															return true;
														}
													}
													var b = a.val();
													if (b.length == 0) {
														m = false;
													}
													if (b) {
														p = p - b;
													}
												});
												if (p != 0) {
													writeError(n, "", 3000);
													return false;
												}
											} else {
												if (k == "13") {
													if (!$(n)[0].fileName) {
														m = false;
													}
												} else {
													if (k == "10") {
														var q = "input";
														if ($(n).attr("select") == "1") {
															q = "select";
														}
														$("table", $(n)).each(function () {
															var a = $(this);
															if (window.hasReferClient) {
																var b = a.parents(".mdivtable")[0];
																if (b && b.style.display == "none") {
																	return true;
																}
															}
															$(q, a).each(function () {
																var r = $(this);
																var s = r.val();
																var c = r.parents("td")[0];
																if (c && c.style.display != "none") {
																	if (s.length == 0 || (q == "select" && s == "-2")) {
																		m = false;
																		n.errorControl = this;
																		return false;
																	}
																}
															});
														});
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
	if (!m && g == "1") {
		f = "此题是必答题";
		if (k == "6" && $(n)[0].isMatrixFillError) {
			f = "请注明原因";
		}
		if (langVer == 1) {
			f = "required";
		}
		writeError(n, f, 1000);
	} else {
		$("span.error", $(n)).hide();
		$("div.field-label", $(n)).css("background", "");
	}
	if (f) {
		return false;
	}
	if (j.removeError) {
		j.removeError();
	}
	return true;
}
function show_prev_page() {
	if (cur_page > 0 && pageHolder[cur_page - 1].hasExceedTime) {
		alert("上一页填写超时，不能返回上一页");
		return;
	}
	var e = $("#divNext")[0];
	var g = $("#divPrev")[0];
	pageHolder[cur_page].style.display = "none";
	e.style.display = "";
	$("#divSubmit").hide();
	cur_page--;
	for (var c = cur_page; c >= 0; c--) {
		if (pageHolder[c].skipPage) {
			cur_page--;
		} else {
			break;
		}
	}
	for (var c = cur_page; c >= 0; c--) {
		var a = $(".field", pageHolder[c]);
		if (a.length == 0) {
			break;
		}
		var f = false;
		for (var b = 0; b < a.length; b++) {
			var d = a[b];
			if (d.style.display != "none") {
				f = true;
				break;
			}
		}
		if (!f && cur_page > 0) {
			cur_page--;
		} else {
			break;
		}
	}
	if (cur_page == 0) {
		g.style.display = "none";
	}
	pageHolder[cur_page].style.display = "";
	pageHolder[cur_page].scrollIntoView();
	showProgress();
}
function show_next_page() {
	var a = $("#divNext a")[0];
	if (a && a.disabled) {
		return;
	}
	if (!validate()) {
		return;
	}
	var b = $(pageHolder[cur_page]).attr("iszhenbie") == "true";
	if (b && window.isRunning) {
		groupAnswer(3);
	} else {
		to_next_page();
	}
}
function to_next_page() {
	var h = $("#divNext")[0];
	var b = $("#divPrev")[0];
	b.style.display = displayPrevPage;
	pageHolder[cur_page].style.display = "none";
	cur_page++;
	if (cur_page == 1) {
		$("#divDesc").hide();
	}
	for (var f = cur_page; f < pageHolder.length; f++) {
		if (pageHolder[f].skipPage) {
			cur_page++;
		} else {
			break;
		}
	}
	var l = false;
	for (var f = cur_page; f < pageHolder.length; f++) {
		var k = $(".field", pageHolder[f]);
		if (k.length == 0 && !l) {
			break;
		}
		var e = false;
		for (var c = 0; c < k.length; c++) {
			var a = k[c];
			if (a.style.display != "none") {
				e = true;
				break;
			}
		}
		if (!e && cur_page < pageHolder.length - 1) {
			cur_page++;
			l = true;
		} else {
			break;
		}
	}
	var d = true;
	for (var f = cur_page + 1; f < pageHolder.length; f++) {
		if (!pageHolder[f].skipPage) {
			d = false;
		}
	}
	if (cur_page >= pageHolder.length - 1 || d) {
		h.style.display = "none";
		$("#divSubmit").show();
	}
	if (cur_page < pageHolder.length - 1) {
		h.style.display = "";
	}
	pageHolder[cur_page].style.display = "";
	initSlider();
	var g = document.getElementById("divMaxTime");
	if (g && g.style.display == "") {
		$("body,html").animate({scrollTop: 0}, 100);
	} else {
		pageHolder[cur_page].scrollIntoView();
	}
	showProgress();
	if (window.hasPageTime) {
		processMinMax();
	}
	fixBottom();
}
function initSlider() {
	if (window.hasSlider) {
		$(".field", pageHolder[cur_page]).each(function () {
			var b = $(this);
			var a = b.attr("type");
			if (a == "8" || a == "12" || a == "9" || a == "10") {
				setTimeout(function () {
					var c = $("input.ui-slider-input:visible", b);
					c.rangeslider({polyfill: false});
				}, 10);
			}
		});
	}
}
function initqSlider(a) {
	if (!window.hasSlider) {
		return;
	}
	if (a.hasInitSlider) {
		return;
	}
	a.hasInitSlider = true;
	var b = $("input.ui-slider-input:visible", a);
	b.rangeslider({polyfill: false});
}
function showProgress() {
	if (totalPage == 1) {
		return;
	}
	var c = cur_page + 1;
	if (c > totalPage) {
		c = totalPage;
	}
	var b = c + "/" + totalPage;
	$(".pagepercent").html(b + "页");
	var a = c * 100 / totalPage;
	$(".pagebar").width(a + "%");
}
function verifyCheckMinMax(a, c, k, e) {
	var d = a.attr("minvalue");
	var h = a.attr("maxvalue");
	var g = a[0];
	if (d == 0 && h == 0) {
		return "";
	}
	var f = 0;
	if (k) {
		f = $("li.ui-li-static[check='1']", a).length;
	} else {
		f = $("input:checked", a).length;
	}
	if (f == 0 && !a.attr("req")) {
		return;
	}
	var b = "&nbsp;&nbsp;&nbsp;您已经选择了" + f + "项";
	var j = true;
	if (h > 0 && f > h) {
		if (e) {
			alert("此题最多只能选择" + h + "项");
			$(e).trigger("click");
			return "";
		}
		b += ",<span style='color:red;'>多选择了" + (f - h) + "项</span>";
		j = false;
	} else {
		if (d > 0 && f < d) {
			b += ",<span style='color:red;'>少选择了" + (d - f) + "项</span>";
			j = false;
			if (!k && f == 1 && $("input:checked", a).parents(".ui-checkbox").hasClass("huchi")) {
				j = true;
			}
		}
	}
	if (!g.errorMessage) {
		g.errorMessage = $(".errorMessage", a)[0];
	}
	if (!j) {
		if (!c) {
			g.errorMessage.innerHTML = b;
		} else {
			writeError(a[0], b, 3000);
		}
		return b;
	} else {
		g.errorMessage.innerHTML = "";
	}
	return "";
}
function verifyTxt(b, f, e) {
	var d = $(f).val();
	var j = $(f).attr("verify");
	var l = $(f).attr("minword");
	var g = $(f).attr("maxword");
	var h = $(b)[0];
	var c = "";
	if (!d) {
		return c;
	}
	if (h.removeError) {
		h.removeError();
	}
	c = verifyMinMax(d, j, l, g);
	if (!c) {
		c = verifydata(d, j);
	}
	if (c) {
		if (!h.errorControl && e) {
			h.errorControl = $(f)[0];
		}
		writeError(h, c, 3000);
		return c;
	}
	var k = $(f).attr("needonly");
	if (k) {
		var a = "/Handler/AnswerOnlyHandler.ashx?q=" + activityId + "&at=" + d + "&qI=" + getTopic(b) + "&o=true&t=" + (new Date()).valueOf();
		$.ajax({
			type: "GET", url: a, async: false, success: function (m) {
				if (m == "false1") {
					c = validate_only;
					if (h.verifycodeinput) {
						h.verifycodeinput.parentNode.style.display = "none";
					}
					writeError(h, c, 3000);
				}
			}
		});
	}
	if (!c && h.needsms && !h.issmsvalid) {
		c = "提示：您的手机号码没有通过验证，请先验证";
		writeError(h, c, 3000);
	}
	return c;
}
function validateMatrix(g) {
	var f = $("table.matrix-rating", $(g)), d = true, e;
	$(g)[0].isMatrixFillError = false;
	$("tr[tp='d']", f).each(function () {
		var h = $(this).attr("fid"), j = $("a.rate-on", $(this));
		e = "";
		if (window.hasReferClient && this.style.display == "none") {
			return true;
		}
		if (j.length == 0) {
			d = false;
		} else {
			e = $(j).attr("dval");
			var a = $(g).attr("ischeck");
			if (a) {
				e = "";
				$(j).each(function () {
					if (e) {
						e += ";";
					}
					e += $(this).attr("dval");
					var m = $(this).attr("needfill");
					if (m) {
						var n = this.fillvalue || "";
						n = replace_specialChar(n).replace(/;/g, "；").replace(/,/g, "，");
						e += spChars[2] + n;
						var l = $(this).attr("req");
						if (l && !n) {
							d = false;
							$(g)[0].isMatrixFillError = true;
							showMatrixFill(this, 1);
							return false;
						}
					}
				});
			} else {
				var c = $(j).attr("needfill");
				if (c) {
					var k = $(j)[0].fillvalue || "";
					k = replace_specialChar(k).replace(/;/g, "；").replace(/,/g, "，");
					e += spChars[2] + k;
					var b = $(j).attr("req");
					if (b && !k) {
						d = false;
						$(g)[0].isMatrixFillError = true;
						showMatrixFill($(j)[0], 1);
						return false;
					}
				}
			}
			$("#" + h, $(g)).attr("value", e);
		}
	});
	return d;
}
function validateScaleRating(d) {
	var e = true, f = $("table.scale-rating", $(d));
	$("tr[tp='d']", f).each(function () {
		var a = $("a.rate-on", $(this));
		if (a.length == 0) {
			e = false;
		} else {
			$("input:hidden", $(d)).attr("value", $(a).attr("val"));
		}
	});
	return e;
}
function jump(c, e) {
	var d = $(c);
	var b = d.attr("type");
	var f = d.attr("hasjump");
	var a = d.attr("anyjump");
	if (f) {
		if (a > 0) {
			jumpAnyChoice(c);
		} else {
			if (a == 0 && b != "3" && b != "5" && b != "7") {
				jumpAnyChoice(c);
			} else {
				jumpByChoice(c, e);
			}
		}
	}
}
function jumpAnyChoice(c, f) {
	var d = $(c);
	var b = d.attr("type");
	var a = false;
	if (b == "1") {
		a = $("input:text", d).val().length > 0;
	} else {
		if (b == "2") {
			a = $("textarea", d).val().length > 0;
		} else {
			if (b == "3") {
				a = $("input[type='radio']:checked", d).length > 0;
			} else {
				if (b == "4") {
					a = $("input[type='checkbox']:checked", d).length > 0;
				} else {
					if (b == "5") {
						a = $("a.rate-on", d).length > 0;
					} else {
						if (b == "6") {
							a = $("a.rate-on", d).length > 0;
						} else {
							if (b == "7") {
								a = $("select", d).val() != -2;
							} else {
								if (b == "8") {
									a = $("input", d).val().length > 0;
								} else {
									if (b == "9" || b == "12") {
										$("input", d).each(function () {
											var g = $(this).val();
											if (g.length > 0) {
												a = true;
											}
										});
									} else {
										if (b == "10") {
											var e = d.attr("select") == "1";
											if (e) {
												$("select", d).each(function () {
													var g = $(this).val();
													if (g != -2) {
														a = true;
													}
												});
											} else {
												$("input", d).each(function () {
													var g = $(this).val();
													if (g.length > 0) {
														a = true;
													}
												});
											}
										} else {
											if (b == "11") {
												a = $("li[check='1']", d).length > 0;
											} else {
												if (b == "13") {
													a = d[0].fileName ? true : false;
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
	jumpAny(a, c, f);
}
function jumpByChoice(d, e) {
	var c = $(d).attr("type");
	var b = $(d)[0];
	if (e.value == "-2") {
		processJ(b.indexInPage - 0, 0);
	} else {
		if (e.value == "-1" || e.value == "") {
			processJ(b.indexInPage - 0, 0);
		} else {
			if ((c == "3" || c == "5" || c == "7")) {
				var f = e.value || $(e).attr("val");
				if (parseInt(f) == f) {
					var a = $(e).attr("jumpto") - 0;
					processJ(b.indexInPage - 0, a);
				}
			}
		}
	}
}
function jumpAny(c, e, g) {
	var f = $(e);
	var d = f.attr("type");
	var h = f.attr("hasjump");
	var a = f.attr("anyjump") - 0;
	var b = f[0];
	if (h) {
		if (c) {
			processJ(b.indexInPage - 0, a, g);
		} else {
			processJ(b.indexInPage - 0, 0, g);
		}
	}
}
function processJ(m, d, e) {
	var a = m + 1;
	var b = cur_page;
	for (var h = cur_page; h < pageHolder.length; h++) {
		var l = $(".field", pageHolder[h]);
		if (d == 1) {
			b = h;
		}
		for (var g = a; g < l.length; g++) {
			var k = getTopic(l[g]);
			if (k == d || d == 1) {
				b = h;
			}
			if (k < d || d == 1) {
				l[g].style.display = "none";
			} else {
				if (relationNotDisplayQ[k]) {
					var f = 1;
				} else {
					l[g].style.display = "";
				}
				var c = $(l[g]).attr("hasjump");
				if (c && !e) {
					clearFieldValue(l[g]);
				}
			}
		}
		a = 0;
	}
	fixBottom();
}
function GetBacktoServer() {
	str = window.location.pathname;
	index = str.lastIndexOf("/");
	page = str.substr(index + 1, str.length - index);
	data = readCookie("history");
	if (data != null && data.toLowerCase() != page.toLowerCase()) {
		window.location.href = window.location.href;
	}
}
function readCookie(h) {
	for (var k = h + "=", j = document.cookie.split(";"), f = 0; f < j.length; f++) {
		var g = j[f];
		while (g.charAt(0) == " ") {
			g = g.substring(1, g.length);
		}
		if (g.indexOf(k) == 0) {
			return g.substring(k.length, g.length);
		}
	}
	return null;
}
function removeError() {
	if (this.errorMessage) {
		this.errorMessage.innerHTML = "";
		this.removeError = null;
		this.style.border = "solid 2px #f7f7f7";
		if (this.errorControl) {
			this.errorControl.style.background = "white";
			this.errorControl = null;
		}
	}
}
function writeError(a, c, b) {
	a = $(a)[0];
	a.style.border = "solid 2px #ff9900";
	if (a.errorMessage) {
		a.errorMessage.innerHTML = c;
	} else {
		a.errorMessage = $(".errorMessage", $(a))[0];
		a.errorMessage.innerHTML = c;
	}
	a.removeError = removeError;
	if (a.errorControl) {
		a.errorControl.style.background = "#FBD5B5";
	}
	if (!firstError) {
		firstError = a;
	}
	return false;
}
function verifydata(d, c) {
	if (!c) {
		return "";
	}
	var a = null;
	if (c.toLowerCase() == "email" || c.toLowerCase() == "msn") {
		a = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;
		if (!a.exec(d)) {
			return validate_email;
		} else {
			return "";
		}
	} else {
		if (c == "日期" || c == "生日" || c == "入学时间") {
			return "";
		} else {
			if (c == "固话") {
				a = /^((\d{4}-\d{7})|(\d{3,4}-\d{8}))(-\d{1,4})?$/;
				if (!a.exec(d)) {
					return validate_phone.replace("，请注意使用英文字符格式", "");
				} else {
					return "";
				}
			} else {
				if (c == "手机") {
					a = /^\d{11}$/;
					if (!a.exec(d)) {
						return validate_mobile.replace("，请注意使用英文字符格式", "");
					} else {
						return "";
					}
				} else {
					if (c == "电话") {
						a = /(^\d{11}$)|(^((\d{4}-\d{7})|(\d{3,4}-\d{8}))(-\d{1,4})?$)/;
						if (!a.exec(d)) {
							return validate_mo_phone.replace("，请注意使用英文字符格式", "");
						} else {
							return "";
						}
					} else {
						if (c == "汉字") {
							a = /^[\u4e00-\u9fa5]+$/;
							if (!a.exec(d)) {
								return validate_chinese;
							} else {
								return "";
							}
						} else {
							if (c == "英文") {
								a = /^[A-Za-z]+$/;
								if (!a.exec(d)) {
									return validate_english;
								} else {
									return "";
								}
							} else {
								if (c == "网址" || c == "公司网址") {
									a = /^http:\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/;
									if (!a.exec(d)) {
										return validate_reticulation;
									} else {
										return "";
									}
								} else {
									if (c == "身份证号") {
										a = /^\d{15}(\d{2}[A-Za-z0-9])?$/;
										if (!a.exec(d)) {
											return validate_idcardNum;
										} else {
											return "";
										}
									} else {
										if (c == "数字") {
											a = /^(\-)?\d+$/;
											if (!a.exec(d)) {
												return validate_num.replace("，请注意使用英文字符格式", "");
											}
										} else {
											if (c == "小数") {
												a = /^(\-)?\d+(\.\d+)?$/;
												if (!a.exec(d)) {
													return validate_decnum;
												}
											} else {
												if (c.toLowerCase() == "qq") {
													a = /^\d+$/;
													var b = /^\w+([-+.]\w+)*@\w+([-.]\\w+)*\.\w+([-.]\w+)*$/;
													if (!a.exec(d) && !b.exec(d)) {
														return validate_qq;
													} else {
														return "";
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
	return "";
}
function verifyMinMax(e, d, c, a) {
	if (d == "数字" || d == "小数") {
		var b = /^(\-)?\d+$/;
		if (d == "小数") {
			b = /^(\-)?\d+(\.\d+)?$/;
		}
		if (!b.exec(e)) {
			if (d == "小数") {
				return validate_decnum;
			} else {
				return validate_num.replace("，请注意使用英文字符格式", "");
			}
		}
		if (c != "" && parseInt(e) - parseInt(c) < 0) {
			return validate_num2 + c;
		}
		if (a != "" && parseInt(e) - parseInt(a) > 0) {
			return validate_num1 + a;
		}
	} else {
		if (a != "" && e.length - a > 0) {
			return validate_info_wd3.format(a, e.length);
		}
		if (c != "" && e.length - c < 0) {
			return validate_info_wd4.format(c, e.length);
		}
	}
	return "";
}
function getTopic(a) {
	return $(a).attr("topic");
}
function displayRelationByType(d, c, b) {
	var a = getTopic(d);
	if (!relationQs[a]) {
		return;
	}
	d.hasDisplayByRelation = new Object();
	$(c, d).each(function () {
		var f = false;
		var g = "";
		if (b == 1 || b == 2 || b == 5) {
			g = this.value;
		} else {
			if (b == 3) {
				g = $("input[type=hidden]", this).val();
			} else {
				if (b == 4) {
					g = $(this).attr("val");
				}
			}
		}
		var h = a + "," + g;
		if (b == 3 && $(this).attr("check")) {
			f = true;
		} else {
			if (b == 4 && $(this).hasClass("rate-on")) {
				f = true;
			} else {
				if ((b == 1 || b == 2) && this.checked) {
					f = true;
				} else {
					if (b == 5 && this.selected) {
						f = true;
					}
				}
			}
		}
		displayByRelation(d, h, f);
		var e = a + ",-" + g;
		if (relationHT[e]) {
			displayByRelationNotSelect(d, e, f);
		}
	});
	fixBottom();
}
function displayByRelation(c, f, b) {
	var d = relationHT[f];
	if (!d) {
		return;
	}
	for (var a = 0; a < d.length; a++) {
		if (c.hasDisplayByRelation[getTopic(d[a])]) {
			continue;
		}
		if (!b && d[a].style.display != "none") {
			loopHideRelation(d[a]);
		} else {
			if (b) {
				d[a].style.display = "";
				initqSlider(d[a]);
				var e = getTopic(d[a]);
				c.hasDisplayByRelation[e] = "1";
				if (relationNotDisplayQ[e]) {
					relationNotDisplayQ[e] = "";
				}
			}
		}
	}
}
function displayByRelationNotSelect(c, f, b) {
	var d = relationHT[f];
	if (!d) {
		return;
	}
	for (var a = 0; a < d.length; a++) {
		if (c.hasDisplayByRelation[getTopic(d[a])]) {
			continue;
		}
		if (b && d[a].style.display != "none") {
			loopHideRelation(d[a]);
		} else {
			if (!b) {
				d[a].style.display = "";
				initqSlider(d[a]);
				var e = getTopic(d[a]);
				c.hasDisplayByRelation[e] = "1";
				if (relationNotDisplayQ[e]) {
					relationNotDisplayQ[e] = "";
				}
			}
		}
	}
}
function loopHideRelation(a) {
	var c = getTopic(a);
	var b = relationQs[c];
	if (b) {
		for (var d = 0; d < b.length; d++) {
			loopHideRelation(b[d], false);
		}
	}
	clearFieldValue(a);
	$(a)[0].style.display = "none";
	if (relationNotDisplayQ[c] == "") {
		relationNotDisplayQ[c] = "1";
	}
}
function checkHuChi(c, e) {
	var b = $(".huchi", c)[0];
	if (!b) {
		return;
	}
	var f = $(e);
	if (!$("input:checked", f)[0]) {
		return;
	}
	var a = $(".ui-checkbox", c);
	var d = f.hasClass("huchi");
	a.each(function () {
		if (this == e) {
			return true;
		}
		var g = $(this);
		if (!$("input:checked", g)[0]) {
			return true;
		}
		if (d) {
			g.trigger("click");
		} else {
			var h = g.hasClass("huchi");
			if (h) {
				g.trigger("click");
			}
		}
	});
}