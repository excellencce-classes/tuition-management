(function($) {
	$.fn.glanceyear = function(massive, options) {

		var $_this = $(this);

		var settings = $.extend({
			eventClick: function(e) { alert('Date: ' + e.date + ', Count:' + e.count); },
			months: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
			weeks: ['S','M','T','W','T','F','S'], // Start with Sunday
			targetQuantity: '.glanceyear-quantity',
			tagId: 'glanceyear-svgTag',
			showToday: false,
			today: new Date(), // Current date
			cellColor: function(count) {
				// Convert to number and handle different possible values
				var numCount = parseInt(count);
				if (numCount === 1 || count === true || count === 'true' || count === 'present') {
					return "#4CAF50";  // Green for Present
				} else if (numCount === 0 || count === false || count === 'false' || count === 'absent') {
					return "#F44336";  // Red for Absent
				} else {
					return "#eee";     // Default color for no data
				}
			}
		}, options );

		var svgElement = createElementSvg('svg', {'width': 45*12+15, 'height': 7*12+15 } );
		var gElementContainer = createElementSvg('g', {'transform': 'translate(15, 15)'} );

		var $_tag = $('<div>')
			.addClass('svg-tag')
			.attr('id', settings.tagId)
			.appendTo( $('body') )
			.hide();

		// Determine start date (April 1, 2025, or April 1, 2026 if past April 1, 2026)
		var currentYear = settings.today.getFullYear();
		var startYear = currentYear;
		if (settings.today < new Date(currentYear, 3, 1)) {
			startYear = currentYear - 1; // Use previous year if before April 1
		}
		var startDate = new Date(startYear, 3, 1); // April 1 of the appropriate year

		// Calculate dayCount as days from startDate to today (inclusive)
		var oneDay = 1000 * 60 * 60 * 24;
		var dayCount = Math.floor((settings.today - startDate) / oneDay) + 1; // Add 1 to include today
		if (dayCount < 0) dayCount = 0; // Ensure non-negative
		if (dayCount > 366) dayCount = 366; // Cap at 366 days

		var monthCount;

		// Calculate total weeks needed to cover dayCount
		var totalWeeks = Math.ceil((dayCount + (7 - startDate.getDay())) / 7);

		// Weeks
		for (var i = 0; i < totalWeeks; i++) {
			var gElement = createElementSvg('g', {'transform': 'translate('+(12*i)+',0)'} );   
			
			// Days in week, loop through all days (Sunday to Saturday)
			for (var j = 0; j < 7; j++) {
				// Calculate the day offset for this cell
				var dayOffset = i * 7 + j - startDate.getDay();
				var rectDate = new Date(startDate);
				rectDate.setDate(rectDate.getDate() + dayOffset);

				// Only render if date is on or before today and on or after startDate
				if (rectDate <= settings.today && rectDate >= startDate) {
					if (rectDate.getMonth() != monthCount && i < 52) {
						// New Month
						var daysLeft = daysInMonth(rectDate) - rectDate.getDate();
						if (daysLeft > 7 || i === 0) { // Show month label at the start of the month or first column
							var textMonth = createElementSvg('text', {'x': 12*i, 'y':'-6', 'class':'month'} );
							textMonth.textContent = getNameMonth(rectDate.getMonth());
							gElementContainer.appendChild(textMonth);
							monthCount = rectDate.getMonth();
						}
					}

					// Day-obj factory
					var rectElement = createElementSvg('rect', {
						'class': 'day',
						'width': '10px',
						'height': '10px',
						'data-date': rectDate.getFullYear()+'-'+(rectDate.getMonth()+1)+'-'+rectDate.getDate(),
						'y': 12 * rectDate.getDay() // Align to the correct day of the week
					});

					// Set default color
					rectElement.setAttribute('fill', '#eee');

					rectElement.onmouseover = function() {
						var dateString = $(this).attr('data-date').split('-');
						var date = new Date(dateString[0], dateString[1]-1, dateString[2]);

						var tagDate = getBeautyDate(date);
						var tagCount = $(this).attr('data-count');
						var tagCountData = $(this).attr('data-count');

						if (tagCountData !== undefined && tagCountData !== null) {
							// Show attendance status instead of scores
							var attendanceStatus = '';
							var numCount = parseInt(tagCountData);
							if (numCount === 1 || tagCountData === true || tagCountData === 'true' || tagCountData === 'present') {
								attendanceStatus = 'Present';
							} else if (numCount === 0 || tagCountData === false || tagCountData === 'false' || tagCountData === 'absent') {
								attendanceStatus = 'Absent';
							} else {
								attendanceStatus = 'No data';
							}
							tagCount = attendanceStatus;
						} else {
							tagCount = 'No attendance data';
						}

						$_tag.html( '<b>' + tagCount + '</b> on ' + tagDate)
						.show()
						.css({
							'left': $(this).offset().left - $_tag.outerWidth()/2+5,
							'top': $(this).offset().top-33
						});
					};

					rectElement.onmouseleave = function() {
						$_tag.text('').hide();
					}

					rectElement.onclick = function() {
						settings.eventClick(
							{
								date: $(this).attr('data-date'),
								count: $(this).attr('data-count') || 0
							}
						);
					}

					gElement.appendChild(rectElement);
				}
			}

			gElementContainer.appendChild(gElement);
		}

		// Add all day labels (Sunday to Saturday)
		for (var i = 0; i < 7; i++) {
			var textDay = createElementSvg('text', {'x':'-14', 'y': 12*i + 8});
			textDay.textContent = getNameWeek(i);
			gElementContainer.appendChild(textDay);
		}
		
		svgElement.appendChild(gElementContainer);

		// Append Calendar to document
		$_this.append(svgElement);

		fillData(massive);

		function createElementSvg(type, prop) {
			var e = document.createElementNS('http://www.w3.org/2000/svg', type);
			for (var p in prop) {
				e.setAttribute(p, prop[p]);
			}
			return e;
		}

		function fillData(massive) {
			var presentCount = 0;
			var daysWithData = 0;
			
			console.log('Attendance data being processed:', massive); // Debug log
			
			for (var m in massive) {
				var dateKey = massive[m].date;
				var rect = $_this.find('rect.day[data-date="' + dateKey + '"]');
				
				console.log('Processing date:', dateKey, 'Value:', massive[m].value); // Debug log
				
				if (rect.length) {
					var value = massive[m].value;
					rect.attr('data-count', value);
					
					// Apply color based on attendance value
					var color = settings.cellColor(value);
					rect.attr('fill', color);
					
					console.log('Applied color:', color, 'for value:', value); // Debug log
					
					// Count present days and total days with data
					if (value === 1 || value === true || value === 'true' || value === 'present') {
						presentCount++;
					}
					daysWithData++;
				}
			}
			
			// Update the summary text to show attendance stats
			$(settings.targetQuantity).text(daysWithData + ' days tracked, ' + presentCount + ' present');
		}

		function getNameMonth(a) {
			return settings.months[a];
		}

		function getNameWeek(a) {
			return settings.weeks[a];
		}

		function getBeautyDate(a) {
			return getNameMonth(a.getMonth()) + ' ' + a.getDate() + ', ' + a.getFullYear();
		}

		function daysInMonth(d) {
			return 32 - new Date(d.getFullYear(), d.getMonth(), 32).getDate();
		}
	};
})(jQuery);