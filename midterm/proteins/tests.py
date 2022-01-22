from django.urls import reverse

from rest_framework.test import APIRequestFactory
from rest_framework.test import APITestCase

from .model_factories import *
from .serializers import *


class PfamTest(APITestCase):

    pfam = None

    def setUp(self):
        self.pfam = PfamFactory()

    def tearDown(self):
        Pfam.objects.all().delete()

    def test_pfamDetailOk(self):
        url = reverse('domain-pfam-detail',
                      kwargs={'domain_id': self.pfam.domain_id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)

    def test_pfamDetailNotFound(self):
        url = reverse('domain-pfam-detail', kwargs={'domain_id': 'notfound'})
        response = self.client.get(url)
        self.assertEqual(response.status_code, 404)

    def test_pfamDetailDomainId(self):
        url = reverse('domain-pfam-detail',
                      kwargs={'domain_id': self.pfam.domain_id})
        response = self.client.get(url)
        self.assertEqual(response.data['domain_id'], self.pfam.domain_id)

    def test_pfamDetailDomainDescription(self):
        url = reverse('domain-pfam-detail',
                      kwargs={'domain_id': self.pfam.domain_id})
        response = self.client.get(url)
        self.assertEqual(
            response.data['domain_description'], self.pfam.domain_description)
