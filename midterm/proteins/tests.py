import json
from django.test import TestCase
from django.urls import reverse
from django.urls import reverse_lazy

from rest_framework.test import APIRequestFactory
from rest_framework.test import APITestCase

from .model_factories import *
from .serializers import *

class PfamTest(APITestCase):
  def test_pfamDetail(self):
    pfam = PfamFactory()
    url = reverse('domain-pfam-detail', kwargs={'domain_id': pfam.domain_id})
    response = self.client.get(url)
    self.assertEqual(response.status_code, 200)