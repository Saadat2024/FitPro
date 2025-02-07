function validation() {
    Swal.fire({
        icon: 'error',
        title: 'Please fill the required fields',
        text: 'Some fields are missing',
        confirmButtonColor: "#1F1F1F",
    });
}


$(document).ready(function () {
    $('.select2').select2();
});



// SHOP

// product sorting
$(document).ready(function () {
    const $productsContainer = $('.shop-items .row'); // Adjusted to match your HTML structure
    const $products = $('.product-card').clone(); // Cloning original products

    $('#orderBy').on('change', function () {
        let sortBy = $(this).val();
        let $sortedProducts;

        if (sortBy === 'default') {
            $sortedProducts = $products; // Original order for default sorting
        } else {
            $sortedProducts = $products.sort(function (a, b) {
                let aVal, bVal;

                switch (sortBy) {
                    case 'price':
                        aVal = parseFloat($(a).data('price'));
                        bVal = parseFloat($(b).data('price'));
                        break;
                    case 'price-desc':
                        aVal = parseFloat($(b).data('price'));
                        bVal = parseFloat($(a).data('price'));
                        break;
                    case 'rating':
                        aVal = parseFloat($(b).data('rating'));
                        bVal = parseFloat($(a).data('rating'));
                        break;
                    case 'date':
                        aVal = new Date($(b).data('date'));
                        bVal = new Date($(a).data('date'));
                        break;
                    default:
                        aVal = bVal = 0;
                }

                return aVal > bVal ? 1 : -1;
            });
        }

        $productsContainer.empty().append($sortedProducts); // Appending sorted products
    });
});


// BMI Calculate

$(document).ready(function () {
    // Form validation
    $("#bmiForm").validate();

    // Toggle height fields and update placeholders based on selected unit
    $("input[name='exampleRadios']").change(function () {
        if ($("#exampleRadios2").is(":checked")) {
            // Imperial Units selected
            $(".imperial-unit").fadeIn('slow');
            $(".metric-unit").hide();
        } else {
            // Metric Units selected
            $(".metric-unit").fadeIn('slow');
            $(".imperial-unit").hide();
        }
    }).trigger("change"); // Initialize on page load

    $("#bmiForm").submit(function (e) {
        e.preventDefault();

        let weight, heightCm, heightFt, heightInch, bmi;

        if ($("#exampleRadios1").is(":checked")) {
            // Metric Units: weight in kilograms and height in centimeters
            weight = parseFloat($("#weightKG").val());
            heightCm = parseFloat($("#heightCM").val());

            // Validate metric inputs
            if (!weight || !heightCm) {
                Swal.fire({
                    title: "Error",
                    text: "Please fill in both weight (kg) and height (cm) for Metric calculation.",
                    icon: "error",
                    confirmButtonText: "OK",
                    confirmButtonColor: "#1F1F1F"
                });
                return;
            }

            // Convert height from cm to meters and calculate BMI
            heightCm /= 100; // cm to meters
            bmi = weight / (heightCm * heightCm);

        } else if ($("#exampleRadios2").is(":checked")) {
            // Imperial Units: weight in pounds and height in feet and inches
            weight = parseFloat($("#weightLBS").val());
            heightFt = parseFloat($("#heightFeet").val());
            heightInch = parseFloat($("#heightInch").val());

            // Validate imperial inputs
            if (!weight || !heightFt || heightInch === undefined) {
                Swal.fire({
                    title: "Error",
                    text: "Please fill in weight (lbs), height in feet, and inches for Imperial calculation.",
                    icon: "error",
                    confirmButtonText: "OK",
                    confirmButtonColor: "#1F1F1F"
                });
                return;
            }

            // Convert feet and inches to total inches
            let totalInches = (heightFt * 12) + heightInch;

            // Calculate BMI using the imperial formula
            bmi = (weight / (totalInches * totalInches)) * 703;
        } else {
            // Show an error if no unit is selected
            Swal.fire({
                title: "Error",
                text: "Please select a unit (Metric or Imperial).",
                icon: "error",
                confirmButtonText: "OK",
                confirmButtonColor: "#1F1F1F"
            });
            return;
        }

        // Show BMI result using SweetAlert
        Swal.fire({
            title: "Your BMI Result",
            text: "Your BMI is: " + bmi.toFixed(2),
            icon: "info",
            confirmButtonText: "OK",
            confirmButtonColor: "#1F1F1F",
        });
    });
});


// dashboard

// sidebar

$(document).ready(function () {
    var navbarBrand = $("#navbar-brand");
    var mainContent = $('#dashboardContent')
    navbarBrand.css('display', 'none');
    mainContent.css('margin-left', '60px');


    $('.bars').on('click', function () {
        $('.sidebar').toggleClass('expanded');


        // Toggle the display of navbarBrand
        if ($('.sidebar').hasClass('expanded')) {
            navbarBrand.css('display', 'block');
            mainContent.css('margin-left', '260px');
        } else {
            navbarBrand.css('display', 'none');
            mainContent.css('margin-left', '60px');
        }
    });
});


// progress bar code start
$(document).ready(function () {
    let currentProgress = 0;

    // Define progress values for each exercise type
    const exerciseProgressMapping = {
        pushups: 10,
        pullups: 20,
        abs: 10,
        squats: 15,
        lunges: 15,
        planks: 10, // Add more exercises as needed
        burpees: 20,
    };

    // Extract exercise names for suggestions
    const exerciseList = Object.keys(exerciseProgressMapping);

    // Initialize form validation
    $("#exerciseForm").validate({
        errorElement: "span", // Wrap error message in <span>
        errorPlacement: function (error, element) {
            error.addClass("text-danger"); // Add Bootstrap error styling
            error.insertAfter(element);   // Place the error message after the input field
        },
        submitHandler: function (form) {
            // Form is valid, handle progress logic
            updateProgress();
        },
    });

    // Add button click handler
    $("#addExerciseBtn").click(function (e) {
        e.preventDefault(); // Prevent default form submission
        $("#exerciseForm").submit(); // Trigger validation
    });

    // Function to update progress bar
    function updateProgress() {
        const exerciseValue = $("#exerciseInput").val().trim().toLowerCase();

        // Get progress increment based on exercise type
        const progressIncrement = exerciseProgressMapping[exerciseValue] || 0; // Default to 0 if not found

        if (progressIncrement === 0) {
            Swal.fire({
                icon: "error",
                title: "Invalid Exercise",
                text: "Please enter a valid exercise (e.g., pushups, pullups, abs).",
            });
            return;
        }

        // Increase progress
        if (currentProgress < 100) {
            currentProgress += progressIncrement;
            if (currentProgress > 100) currentProgress = 100; // Cap progress at 100%

            // Update the progress bar
            $(".progress-bar")
                .css("width", currentProgress + "%")
                .attr("aria-valuenow", currentProgress)
                .text(Math.round(currentProgress) + "%");
        }

        // Notify user when progress reaches 100%
        if (currentProgress === 100) {
            Swal.fire({
                icon: "success",
                title: "Congrats!",
                text: "You completed 100% of your exercises!",
                showConfirmButton: false,
            });
        }

        // Clear the input field after progress update
        $("#exerciseInput").val("");
        $(".suggestion-list").empty(); // Clear suggestions
    }

    // Function to show exercise suggestions
    $("#exerciseInput").on("input", function () {
        const inputVal = $(this).val().toLowerCase().trim();
        $(".suggestion-list").empty(); // Clear previous suggestions

        if (inputVal) {
            const filteredExercises = exerciseList.filter(exercise =>
                exercise.toLowerCase().includes(inputVal)
            );

            // Populate suggestions
            filteredExercises.forEach(exercise => {
                $(".suggestion-list").append(
                    `<li class="list-group-item suggestion-item">${exercise}</li>`
                );
            });

            $(".suggestion-list").show(); // Show the suggestion list
        } else {
            $(".suggestion-list").hide(); // Hide the suggestion list if input is empty
        }
    });

    // Handle click on suggestion
    $(".suggestion-list").on("click", ".suggestion-item", function () {
        const selectedExercise = $(this).text();
        $("#exerciseInput").val(selectedExercise); // Set the selected value to input
        $(".suggestion-list").empty(); // Clear suggestions
        $(".suggestion-list").hide();  // Hide the suggestion list
    });

    // Close suggestion list when clicking outside
    $(document).on("click", function (e) {
        if (!$(e.target).closest("#exerciseInput").length) {
            $(".suggestion-list").hide(); // Hide suggestions if clicked outside
        }
    });
});


// progress bar code end

// password strength
$(document).ready(function () {
    const $passwordInput = $('#createAccPassowrd');
    const $strengthBar = $('#strengthBar');

    $passwordInput.on('input', function () {
        const password = $passwordInput.val();
        let strength = 0;

        // Show the strength bar when the user starts typing
        if (password.length > 0) {
            $strengthBar.fadeIn();
        } else {
            $strengthBar.fadeOut(); // Hide the strength bar if the input is cleared
        }

        // Calculate password strength
        if (password.length >= 8) strength += 1;
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[0-9]/.test(password)) strength += 1;
        if (/[@$!%*?&]/.test(password)) strength += 1;

        // Update the strength bar width and color
        $strengthBar.css('width', `${strength * 25}%`);
        $strengthBar.css('background', strength < 2 ? 'red' : strength < 3 ? 'orange' : 'green');
    });

    // Prevent form submission and show alert
    $('#createAccountForm').on('submit', function (e) {
        e.preventDefault();
        alert('Account created successfully!');
    });
});


// dashbaord number counter
// $(document).ready(function () {
//     // Set the initial count values
//     var counter1 = 0;
//     var counter2 = 0;
//     var counter3 = 0;
//     var counter4 = 0;

//     var interval1 = setInterval(function () {

//         counter1++;
//         $('.dashboard .counter1').text(counter1);

//         if (counter1 === 40) {
//             clearInterval(interval1);
//         }
//     }, 40);

//     var interval2 = setInterval(function () {

//         counter2++;
//         $('.dashboard .counter2').text(counter2);

//         if (counter2 === 20) {
//             clearInterval(interval2);
//         }
//     }, 40);

//     var interval3 = setInterval(function () {

//         counter3++;
//         $('.dashboard .counter3').text(counter3);

//         if (counter3 === 45) {
//             clearInterval(interval3);
//         }
//     }, 40);

//     var interval4 = setInterval(function () {

//         counter4++;
//         $('.dashboard .counter4').text(counter4);

//         if (counter4 === 50) {
//             clearInterval(interval4);
//         }
//     }, 40);
// });
