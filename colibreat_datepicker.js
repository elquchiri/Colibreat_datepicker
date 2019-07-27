(function ($) {

	$.fn.colibreat_datepicker = function (options) {
		var settings = $.extend({
			dateFormat: "dd/mm/yyyy",
			enabledDates: null,
			complete: null,
			date: new Date(),
			todayButton: true
		}, options);

		// generate a datepicker id from 1 to 1001
		var datepicker_id = Math.floor(Math.random() * Math.floor(1001));

		var month_full_name     = ["Janvier", "Fevrier", "Mars", "Avril", "Mai", "Juin", "Juiller", "Aout", "Septembre", "Octobre", "Novembre", "Decembre"];
		var week_days_full_name = ["lu", "ma", "me", "je", "ve", "sa", "di"];


		var hooks = {
			addZero: function(n) {
				return n <= 9 ? "0"+n : n;
			}
		};

		var methods = {
			init_week_standard: function (day_number) {
				switch (day_number) {
					case 0:
						return 7;
						break;
					default:
						return day_number;
				}
			},
			formatOutputDate: function () {
				var date  = settings.date;
				var day   = date.getDate();
				var month = date.getMonth() + 1;
				var year  = date.getFullYear();

				switch (settings.dateFormat) {
					case "dd/mm/yyyy":
						return (day < 10 ? "0" + day : day) + "/" + (month < 10 ? "0" + month : month) + "/" + year;
						break;
					case "yyyy/mm/dd":
						return year + "/" + (month < 10 ? "0" + month : month) + "/" + (day < 10 ? "0" + day : day);
						break;
					case "yyyy-mm-dd":
						return year + "-" + (month < 10 ? "0" + month : month) + "-" + (day < 10 ? "0" + day : day);
						break;
					default:
						return (day < 10 ? "0" + day : day) + "/" + (month < 10 ? "0" + month : month) + "/" + year;
						break;
				}
			},
			updateNavigationView: function () {
				$('#' + datepicker_id + ' .navigation .month').html(month_full_name[settings.date.getMonth()]);
				$('#' + datepicker_id + ' .navigation .year').html(settings.date.getFullYear());

				var select_month = "";
				for(var i=0; i<month_full_name.length; i++)
					select_month += "<option value=\""+ i +"\">"+ month_full_name[i] +"</option>";

				var select_year = "";
				for(var i=settings.date.getFullYear() - 5; i<=settings.date.getFullYear() + 5; i++)
					select_year += "<option value=\""+ i +"\">"+ i +"</option>";

				$('#' + datepicker_id + ' .navigation .select_month').html(select_month).val(settings.date.getMonth());
				$('#' + datepicker_id + ' .navigation .select_year').html(select_year).val(settings.date.getFullYear());

			},
			todayButton: function () {
				if (settings.todayButton) {
					$('#' + datepicker_id).append("<div class=\"today\">" +
						"<a class=\"btn btn-light btn-sm btn-block\" style=\"font-size: 13px; font-weight: bold\">Aujourd'hui</a>" +
						"</div>"
					);

					// Today button
					if (settings.enabledDates != null)
						if (settings.enabledDates.includes(new Date().getDate() + "/" + (new Date().getMonth() + 1) + "/" + new Date().getFullYear()) == false)
							$('#' + datepicker_id + ' .today button').attr("disabled", "true");
				}
			},
			updateDatepicker: function () {
				var date = settings.date;

				var y         = date.getFullYear();
				var m         = date.getMonth();
				var first_day = this.init_week_standard(new Date(y, m, 1).getDay());
				var lastDay   = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

				var table = "";

				var v = first_day;

				table += "<table><tr><th>lu</th><th>ma</th><th>me</th><th>je</th><th>ve</th><th>sa</th><th>di</th></tr><tr>";
				for (var j = 1; j < parseInt(first_day); j++)
					table += "<td class=\"hidden\"></td>";
				// EnabledDates
				if (settings.enabledDates == null)
					for (var i = 1; i <= lastDay; i++) {
						table += "<td>" + i + "</td>";
						if (v == 7) {
							table += "</tr><tr>";
							v = 1;
						} else {
							v++;
						}
					}
				else
					for (var i = 1; i <= lastDay; i++) {
						if (settings.enabledDates.includes(settings.date.getFullYear() + "-" + hooks.addZero((settings.date.getMonth() + 1)) + "-" + hooks.addZero(i)))
							table += "<td>" + i + "</td>";
						else
							table += "<td class=\"disabled\">" + i + "</td>";
						if (v == 7) {
							table += "</tr><tr>";
							v = 1;
						} else {
							v++;
						}
					}

				table += "</tr></table>";

				$('#' + datepicker_id + ' .datepicker').html(table);
			}
		};


		return this.each(function () {

			var $this       = $(this);
			var elementType = $(this).prop('nodeName');

			var datepicker = "<div class=\"colibreat-datepicker\" id=\"" + datepicker_id + "\">" +
				"<div class=\"navigation\">" +
					"<div class=\"row\">" +
						"<div class=\"col-2 text-left\">" +
							"<a class=\"btn btn-sm changeDate\" id=\"left\"><i class=\"fas fa-angle-left\"></i></a>" +
						"</div>" +
						"<div class=\"col-8\">" +
							"<div class=\"row\">" +
								"<div class=\"col-7\">" +
									"<select class=\"form-control form-control-sm select_month\"></select>" +
								"</div>" +
								"<div class=\"col-5 pl-0\">" +
									"<select class=\"form-control form-control-sm select_year\"></select>" +
								"</div>" +
							"</div>" +
						"</div>" +
						"<div class=\"col-2\">" +
							"<a class=\"btn btn-sm changeDate\" id=\"right\"><i class=\"fas fa-angle-right\"></i></a>" +
						"</div>" +
					"</div>" +
				"</div>" +
				"<div class=\"datepicker\">" +

				"</div>" +
				"</div>";

			if (elementType == 'DIV') {
				// print element into selector (div)
				$this.html(datepicker);
			} else {
				// add element to DOM after selector (input)
				$this.after(datepicker);
				var position = $this.position();
				var offset = $this.offset();

				var left_position = position.left;
				var bts_height = parseInt($('.form-control').css('height'));
				var top_position = position.top + ($this.height());

				$('#' + datepicker_id).css({position: "absolute", 'margin-left': 0, 'margin-top': 0, top: top_position+'px', left: left_position+'px', display: "none"});

				// add click event on element (input) to show datapicker
				$this.click(function() {
					$('#' + datepicker_id).toggle();
				});
			}

			// update naviation
			methods.updateNavigationView();
			// update Datepicker
			methods.updateDatepicker();
			// todayButton
			methods.todayButton();


			$('#' + datepicker_id + ' .changeDate').click(function () {
				var action = $(this).attr("id");
				switch (action) {
					case "left":
						if (settings.date.getMonth() == 0) {

							settings.date = new Date(settings.date.getFullYear() - 1, 0, 1);
							settings.date.setMonth(11);
						} else
							settings.date = new Date(settings.date.getFullYear(), settings.date.getMonth() - 1, 1);
						break;
					case "right":
						if (settings.date.getMonth() == 11)
							settings.date = new Date(settings.date.getFullYear() + 1, 0, 1);
						else
							settings.date = new Date(settings.date.getFullYear(), settings.date.getMonth() + 1, 1);
						break;
				}
				methods.updateDatepicker();
				// update naviation
				methods.updateNavigationView();
			});

			$('body').on("click", "#" + datepicker_id + " table td:not(.hidden):not(.disabled)", function () {
				var datepicker_date = parseInt($(this).html());
				settings.date.setDate(datepicker_date);

				if (elementType == 'DIV') {
					$(this).addClass("selected");
					//alert(methods.formatOutputDate());
				}else{
					$('#' + datepicker_id).toggle();
					$this.val(methods.formatOutputDate());
				}
			});

			$('body').on("change", '#' + datepicker_id + ' .navigation .select_month', function() {
				var month = $(this).val();
				settings.date.setMonth(month);
				// update datepicker
				methods.updateDatepicker();
				// update naviation
				methods.updateNavigationView();
			});

			$('body').on("change", '#' + datepicker_id + ' .navigation .select_year', function() {
				var year = $(this).val();
				settings.date.setFullYear(year);
				// update datepicker
				methods.updateDatepicker();
				// update naviation
				methods.updateNavigationView();
			});

			$('#' + datepicker_id + ' .today a').click(function () {
				settings.date = new Date();
				// update datepicker
				methods.updateDatepicker();
				// update naviation
				methods.updateNavigationView();

				if (elementType == 'DIV') {
					// print element into selector (div)
					
				} else {
					$this.val(methods.formatOutputDate());
					$('#' + datepicker_id).hide();
				}
			});

		});
	}

})(jQuery);