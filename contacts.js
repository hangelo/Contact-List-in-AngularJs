

var MyContacts = angular.module('MyContacts', ['ngRoute'])

    // Configure the urls
    .config(function ($routeProvider, $locationProvider){
        $routeProvider

        // Home url
        .when('/Home', {
            templateUrl: 'default.html',
        })

        // Show a selected contact information
        .when('/contact/:contact_index', {
            templateUrl: 'contact_info.html',
            controller: 'infoContact'
        })

        // Insert a new contact
        .when('/Insert', {
            templateUrl: 'contact_form.html',
            controller: 'AddContact'
        })

        // Edit an existing contact
        .when('/edit/:contact_index', {
            templateUrl: 'contact_form.html',
            controller: 'EditContact'
        })

        // The default page is always Home
        .otherwise({redirectTo: '/Home'});
    })


    // Information of the Navigation bar
    .controller('navigation-bar', function ($scope, $rootScope) {
        $scope.nav = {
            // Two buttons into the navigation bar
            navItems : ['Home', 'Insert'],
            selected : 0,

            // When one button is clicked, the navigation address is changed
            navClick : function ($index) {
                $scope.nav.selected = $index;
            }
        };

        // If the previews command was REMOVE, clean that message here
        $rootScope.removed = '';
    })


    // Go to "Home" page
    .controller('Home', function ($scope, $rootScope, ContactService){
    //ContactService.init();
        $scope.vet_contacts = ContactService.get_contacts();

        $scope.removeContact = function (item) {
            var index = $scope.vet_contacts.indexOf(item);
            $scope.vet_contacts.splice(index, 1);

            // Display a message to the user
            $rootScope.removed = 'Contact removed successful!';
        };
    })


    // Show the contact content when a contact is selected
    .controller('infoContact', function ($scope, $rootScope, $routeParams){

        // Get the index of the selected contact
        var index = $routeParams.contact_index;

        // Get the contact from the array
        $scope.selected_contact = $scope.vet_contacts[index];

        // If the previews command was REMOVE, clean that message here
        $rootScope.removed = '';
    })


    // Add a new contact
    .controller('AddContact', function ($scope, $rootScope, $location) {

        // After save, navigate to the same saved contact
        $scope.path = $location.path();

        // Add the new contact into the list
        $scope.AddContact = function () {
            var contact = $scope.selected_contact;
            contact.id = $scope.vet_contacts.length;
            $scope.vet_contacts.push(contact);
        };

    })


    // Edit a chosen contact
    .controller('EditContact', function ($scope, $rootScope, $routeParams){
        $scope.index = $routeParams.contact_index;
        $scope.selected_contact = $scope.vet_contacts[$scope.index];
    })


    // Show the contact list
    .directive('contact', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'contact.html'
        }
    })


    // Contact control
    .factory('ContactService', ['$http', function($http) {
        /**
        Read the file content into an array. This will be the main contact list
        */

        var vet_contacts = [];

        var factory = {};
        factory.get_contacts = function() {
            return vet_contacts;
        }

        factory.init = function() {}
        var mainInfo = $http.get('data.json').success(function(response) {
            for (var i = 0; i < response.length; i++) {

                // Create am object from each file content and insert it into the contact list
                var c = {
                    id: vet_contacts.length,
                    name: response[i].name,
                    email: response[i].email,
                    phone: response[i].phone,
                    identification: response[i].identification,
                    notes: response[i].notes
                };
                vet_contacts.push(c);
            }
        });

        return factory;
    }]);

