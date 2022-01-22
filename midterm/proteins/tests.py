import json
from django.test import TestCase
from django.urls import reverse
from django.urls import reverse_lazy

from rest_framework.test import APIRequestFactory
from rest_framework.test import APITestCase

from .model_factories import *
from .serializers import *

class PfamTest(APITestCase):
  def test_pfamDetailOk(self):
    pfam = PfamFactory()
    url = reverse('domain-pfam-detail', kwargs={'domain_id': pfam.domain_id})
    response = self.client.get(url)
    self.assertEqual(response.status_code, 200)

  def test_pfamDetailNotFound(self):
    url = reverse('domain-pfam-detail', kwargs={'domain_id': 'notfound'})
    response = self.client.get(url)
    self.assertEqual(response.status_code, 404)

  def test_pfamDetailDomainId(self):
    pfam = PfamFactory()
    url = reverse('domain-pfam-detail', kwargs={'domain_id': pfam.domain_id})
    response = self.client.get(url)
    self.assertEqual(response.data['domain_id'], pfam.domain_id)
  
  def test_pfamDetailDomainDescription(self):
    pfam = PfamFactory()
    url = reverse('domain-pfam-detail', kwargs={'domain_id': pfam.domain_id})
    response = self.client.get(url)
    self.assertEqual(response.data['domain_description'], pfam.domain_description)