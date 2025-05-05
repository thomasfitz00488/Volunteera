from django.test import TestCase, Client
from .models import *
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
import datetime
# model tests

class test_ModelTests(TestCase):
    def setUp(self):
        self.c = Client()
        User = get_user_model()
        self.elderly = Category.objects.create(name = "Elderly", description = "Help the elderly")
        self.medical = Category.objects.create(name = "Medical", description = "Help the medical")
        self.animal = Category.objects.create(name = "Animal", description = "Help the animals")
        self.greener_planet = Category.objects.create(name = "Greener Planet", description = "Help the planet")

        self.elderly_interest = Interest.objects.create(name = "Elderly interest", category = self.elderly, description = "")
        self.medical_interest = Interest.objects.create(name = "Medical interest", category = self.medical, description = "")
        self.animal_interest = Interest.objects.create(name = "Animal interest", category = self.animal, description = "")
        self.greener_planet_interest = Interest.objects.create(name = "Greener Planet interest", category = self.greener_planet, description = "")

        Interest.objects.create(name = "antoerh interest", category = self.greener_planet, description = "")
        Interest.objects.create(name = "another interest", category = self.medical, description = "")
        Interest.objects.create(name = "interest interest", category = self.elderly, description = "")
        Interest.objects.create(name = "interest", category = self.animal, description = "")
        Interest.objects.create(name = "one more interest", category = self.medical, description = "")

        self.user = User.objects.create_user(username = "test1", first_name = "Test", last_name = "Surname", password = "SecurePassword", email = "test@gmail.com")
        self.volunteer = Volunteer.objects.create(display_name = "Diplay test", user = self.user)

        # creating friends
        self.user1 = User.objects.create_user(username = "test2", first_name = "Test1", last_name = "Surname1", password = "SecurePassword", email = "test1@gmail.com")
        self.friend1 = Volunteer.objects.create(display_name = "Friend", user = self.user1)
        self.user2 = User.objects.create_user(username = "test3", first_name = "Test2", last_name = "Surname2", password = "SecurePassword", email = "test2@gmail.com")
        self.friend2 = Volunteer.objects.create(display_name = "Friend1", user = self.user2)
        self.user3 = User.objects.create_user(username = "test4", first_name = "Test2", last_name = "Surname2", password = "SecurePassword", email = "test3@gmail.com")
        self.friend3 = Volunteer.objects.create(display_name = "Friend2", user = self.user3)

        Friendship.objects.create(from_volunteer = self.volunteer, to_volunteer = self.friend1, status = "pending")
        Friendship.objects.create(from_volunteer = self.volunteer, to_volunteer = self.friend2, status = "accepted")
        Friendship.objects.create(from_volunteer = self.volunteer, to_volunteer = self.friend3, status = "rejected")

        self.organization_user = User.objects.create_user(username = "test5", first_name = "org", last_name = "anization", password = "SecurePassword", email = "test1@org.com")
        self.organization = Organization.objects.create(name = "org", user = self.organization_user, charity_number = 10101, description = "MY ORG", approved = True)

    def test_opportunity_creation(self):

        details = {
            'id': 1,
            'latitude': 51.5074,
            'longitude': -0.1278,
            'title': 'testOpp',
            'description': 'description',
            'requirements': 'nothing',
            'location_name': 'london',
            'organization': 'distater',
            'start_time': 10,
            'end_time': 20,
            'estimated_effort_ranking': 'low',
            'estimated_duration': 1,
            'start_date': datetime.date.today(),
            'end_date': datetime.date.today(),
            'capacity': 20,
            'pending_applications': 2,
            'request_applications': 2
        }

        user_details = {
            'email': self.user.email,
            'password': "SecurePassword"
        }

        bad_details = {
            'email': "alexxxxx",
            'password': "pass"
        }

        response = self.c.post('/api/opportunities/create/', details)
        self.assertEqual(response.status_code, 401) # not logged in

        response = self.c.post('/api/auth/login/', bad_details)
        self.assertEqual(response.status_code, 400)

        response = self.c.post('/api/auth/login/', user_details, follow=True)
        self.assertEqual(response.status_code, 200)

        client = APIClient()
        client.force_authenticate(user=self.user)  # try to create an opportunity not as a organization
        response = client.post('/api/opportunities/create/', details)
        self.assertEqual(response.status_code, 403) 

        client.force_authenticate(user=self.organization_user)  # try to create opportunity as an organization
        response = client.post('/api/opportunities/create/', details)
        self.assertEqual(response.status_code, 201) 

        response = self.c.get("/api/volunteers/pending/1/")
        self.assertEqual(response.status_code, 200)

        response = self.c.get("/api/volunteers/requested/1/")
        self.assertEqual(response.status_code, 200)

        self.client = APIClient()
        self.client.force_authenticate(user=self.organization_user)
        response = self.client.get("/api/organization/stats/")
        self.assertEqual(response.status_code, 200)

        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        response = self.client.delete("/api/friendship/delete/2/3/") # cannot delete friend if you are not one of the users
        self.assertEqual(response.status_code, 403)

        self.client = APIClient()
        self.client.force_authenticate(user=self.user2)
        response = self.client.delete("/api/friendship/delete/2/3/")
        self.assertEqual(response.status_code, 200)

        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        response = self.client.post("/api/friendship/create/2/3/") # cannot create friend if you are not one of the users
        self.assertEqual(response.status_code, 403)

        self.client = APIClient()
        self.client.force_authenticate(user=self.user2)
        response = self.client.post("/api/friendship/create/2/3/")
        self.assertEqual(response.status_code, 201)

        self.client.force_authenticate(user=self.user1)
        response = self.client.post("/api/friendship/accept/3/2/")
        self.assertEqual(response.status_code, 201)

        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        response = self.client.post("/api/friendship/accept/2/3/") # cannot accept friend if you are not the recieving user
        self.assertEqual(response.status_code, 403)

        data = {
            'f_name': '',
            'l_name': '',
            'display_name': '',
            'interests': [1,2,3],
            'password': '',
            'passwordNew': '',
            'passwordConfirm': '',
            'showName': False,
            'showFriends': False
        }

        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        response = self.client.put("/api/volunteer/1/", data) # updating user
        self.assertEqual(response.status_code, 200)

        data = {
            'f_name': '',
            'l_name': '',
            'display_name': '',
            'interests': [1,2,3],
            'password': 'SecurePassword',
            'passwordNew': 'fasaFASD',
            'passwordConfirm': 'fsa',
            'showName': False,
            'showFriends': False
        }

        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        response = self.client.put("/api/volunteer/1/", data) # updating user with non matching passwords
        self.assertEqual(response.status_code, 400)

        data = {
            'f_name': '',
            'l_name': '',
            'display_name': '',
            'interests': [1,2,3],
            'password': 'SecurePassword',
            'passwordNew': 'pass',
            'passwordConfirm': 'pass',
            'showName': False,
            'showFriends': False
        }

        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        response = self.client.put("/api/volunteer/1/", data) # updating user with matching passwords
        self.assertEqual(response.status_code, 200)

        data = {
            'f_name': '',
            'l_name': '',
            'display_name': '',
            'interests': [1,2,3],
            'password': 'paaaaa',
            'passwordNew': 'pass',
            'passwordConfirm': 'pass',
            'showName': False,
            'showFriends': False
        }

        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        response = self.client.put("/api/volunteer/1/", data) # updating user with wrong verification password
        self.assertEqual(response.status_code, 400)

        data = {
            'max_distance': 100,
            'postcode': 'gu2 9sa',
        }

        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        response = self.client.post("/api/opportunities/", data) # checking distance filtering 
        self.assertEqual(response.status_code, 200)

        data = {
            'opportunity': 1,
            'content': 'Content',
            'title': 'Title'
        }

        self.client_dis = APIClient()
        self.client_dis.force_authenticate(user=self.user)
        response = self.client_dis.post("/api/opportunities/1/", data) # checking discussion creation
        self.assertEqual(response.status_code, 200)

        data = {
            'opportunity': 1,
            'content': 'Content',
        }

        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        response = self.client.post("/api/opportunities/1/", data) # checking discussion creation with wrong content
        self.assertEqual(response.status_code, 403)

        data = {
            'title': 'testOpp',
            'description': 'description',
            'requirements': 'nothing',
            'start_time': 10,
            'end_time': 20,
            'estimated_effort_ranking': 'low',
            'duration': 1,
            'start_date': '2025-03-21T12:14',
            'end_date': '2025-04-21T12:14',
            'capacity': 20,
        }

        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        response = self.client.post("/api/opportunities/1/", data) # checking opportunity update when logged in as wrong user
        self.assertEqual(response.status_code, 403)

        self.client = APIClient()
        self.client.force_authenticate(user=self.organization_user)
        response = self.client.post("/api/opportunities/1/", data) # checking opportunity update when logged in as correct user
        self.assertEqual(response.status_code, 200)

        self.client1 = APIClient()
        self.client1.force_authenticate(user=self.user)
        response = self.client.post("/api/opportunities/1/apply/", {'dates': '2025-03-22T12:14'}) # checking opportunity apply for id 1
        self.assertEqual(response.status_code, 200)

        response = self.c.get("/api/opportunities/1/discussions/")
        self.assertEqual(response.status_code, 200)

        data = {
            'id': 1,
            'answer': 'Answer',
        }

        self.client_dis.force_authenticate(user=self.user)
        response = self.client_dis.post("/api/opportunities/1/discussions/", data) # checking discussion answer with wrong user
        self.assertEqual(response.status_code, 403)

        self.client_dis.force_authenticate(user=self.organization_user)
        response = self.client_dis.post("/api/opportunities/1/discussions/", data) # checking discussion answer with correct user
        self.assertEqual(response.status_code, 200)

        self.client_dis.force_authenticate(user=self.organization_user)
        response = self.client_dis.delete("/api/opportunities/1/discussions/", data) # checking discussion answer with correct user
        self.assertEqual(response.status_code, 403)

        self.client_dis.force_authenticate(user=self.user)
        response = self.client_dis.delete("/api/opportunities/1/discussions/", data) # checking discussion answer with correct user
        self.assertEqual(response.status_code, 200)


        
    def test_gets(self):
        self.c = Client()
        
        response = self.c.get("/api/volunteer/list/")
        self.assertEqual(response.status_code, 200)

        response = self.c.get("/api/categories/")
        self.assertEqual(response.status_code, 200)

        response = self.c.get("/api/interests/")
        self.assertEqual(response.status_code, 200)

        response = self.c.get("/api/volunteer/1/")
        self.assertEqual(response.status_code, 200)

        response = self.c.get("/api/opportunities/")
        self.assertEqual(response.status_code, 200)
        
        

        

        

        
        