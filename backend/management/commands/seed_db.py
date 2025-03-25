from django.core.management.base import BaseCommand
from backend.models import *
from django.utils.timezone import now, timedelta

class Command(BaseCommand):
    help = 'Load data for db'

    def handle(self, *args, **kwargs):
        # Create Users
        red_cross_user, _ = User.objects.get_or_create(
            email="redcross@redcross.org.uk",
            defaults={"username": "red_cross"}
        )
        red_cross_user.set_password("password")
        red_cross_user.save()

        bhf_user, _ = User.objects.get_or_create(
            email="BritishHF@bhf.org.uk",
            defaults={"username": "british_hf"}
        )
        bhf_user.set_password("password")
        bhf_user.save()

        cancer_research_user, _ = User.objects.get_or_create(
            email="CancerResearch@cancer.org.uk",
            defaults={"username": "cancer_research"}
        )
        cancer_research_user.set_password("password")
        cancer_research_user.save()

        alzheimers_society_user, _ = User.objects.get_or_create(
            email="alzheimers@alzheimers.org.uk",
            defaults={"username": "alzheimers_society"}
        )
        alzheimers_society_user.set_password("password")
        alzheimers_society_user.save()

        guide_dogs_user, _ = User.objects.get_or_create(
            email="guide@guidedogs.org.uk",
            defaults={"username": "guide_dogs"}
        )
        guide_dogs_user.set_password("password")
        guide_dogs_user.save()

        macmillan_cancer_support_user, _ = User.objects.get_or_create(
            email="mcs@macmillan.org.uk",
            defaults={"username": "mcs"}
        )
        macmillan_cancer_support_user.set_password("password")
        macmillan_cancer_support_user.save()

        save_the_children_user, _ = User.objects.get_or_create(
            email="SaveTheChildren@savethechildren.org.uk",
            defaults={"username": "save_the_children"}
        )
        save_the_children_user.set_password("password")
        save_the_children_user.save()

        
        national_trust_user, _ = User.objects.get_or_create(
            email="Trust@nationaltrust.org.uk",
            defaults={"username": "national_trust"}
        )
        national_trust_user.set_password("password")
        national_trust_user.save()

        marie_curie_user, _ = User.objects.get_or_create(
            email="mariecurie@mariecurie.org.uk",
            defaults={"username": "marie_curie"}
        )
        marie_curie_user.set_password("password")
        marie_curie_user.save()

        charities_aid_foundation_user, _ = User.objects.get_or_create(
            email="CAF@cafonline.or",
            defaults={"username": "caf"}
        )
        charities_aid_foundation_user.set_password("password")
        charities_aid_foundation_user.save()

        royal_national_lifeboat_institution_user, _ = User.objects.get_or_create(
            email="RNLI@rnli.org.uk",
            defaults={"username": "RNLI"}
        )
        royal_national_lifeboat_institution_user.set_password("password")
        royal_national_lifeboat_institution_user.save()

        rspca_user, _ = User.objects.get_or_create(
            email="rspca@rspca.org.uk",
            defaults={"username": "rspca"}
        )
        rspca_user.set_password("password")
        rspca_user.save()

        arts_council_england_user, _ = User.objects.get_or_create(
            email="ace@artscouncil.org.uk",
            defaults={"username": "ace"}
        )
        arts_council_england_user.set_password("password")
        arts_council_england_user.save()

        feeding_britain_user, _ = User.objects.get_or_create(
            email="feed@feedingbritain.org",
            defaults={"username": "feeding_britain"}
        )
        feeding_britain_user.set_password("password")
        feeding_britain_user.save()

        womans_aid_user, _ = User.objects.get_or_create(
            email="womansaid@womensaid.org.uk",
            defaults={"username": "womans_aid"}
        )
        womans_aid_user.set_password("password")
        womans_aid_user.save()

        
        youth_sport_trust_user, _ = User.objects.get_or_create(
            email="youthsport@youthsporttrust.org",
            defaults={"username": "youth_sport"}
        )
        youth_sport_trust_user.set_password("password")
        youth_sport_trust_user.save()

        # Create Organisations
        red_cross_org, _ = Organization.objects.get_or_create(
            user=red_cross_user,
            defaults={
                "name": "Red Cross",
                "charity_number": "220949",
                "description": "The Red Cross shelters, feeds, and provides comfort to people affected by disasters...",
                "approved": True
            }
        )

        bhf_org, _ = Organization.objects.get_or_create(
            user=bhf_user,
            defaults={
                "name": "British Heart Foundation",
                "charity_number": "225971",
                "description": "BHF is the biggest independent funder of heart and circulatory research in the UK...",
                "approved": True
            }
        )
        categories = [
            "Elderly",
            "Medical",
            "Disability",
            "Animal",
            "Sports",
            "Greener Planet",
            "Educational",
            "Community",
        ]

        for category in categories:
            obj, created = Category.objects.get_or_create(name=category)
        
        # Create Organizations
        cancer_research_org, _ = Organization.objects.get_or_create(
            user=cancer_research_user,
            defaults={
                "name": "Cancer Research UK",
                "charity_number": "1089464",
                "description": "Cancer Research UK is the world's largest independent cancer research organization...",
                "approved": True
            }
        )

        alzheimers_society_org, _ = Organization.objects.get_or_create(
            user=alzheimers_society_user,
            defaults={
                "name": "Alzheimer's Society",
                "charity_number": "296645",
                "description": "Alzheimer's Society is the UK's leading dementia charity, campaigning for change...",
                "approved": True
            }
        )

        guide_dogs_org, _ = Organization.objects.get_or_create(
            user=guide_dogs_user,
            defaults={
                "name": "Guide Dogs",
                "charity_number": "209617",
                "description": "Guide Dogs provides mobility and freedom to blind and partially sighted people...",
                "approved": True
            }
        )

        macmillan_cancer_support_org, _ = Organization.objects.get_or_create(
            user=macmillan_cancer_support_user,
            defaults={
                "name": "Macmillan Cancer Support",
                "charity_number": "261017",
                "description": "Macmillan Cancer Support provides specialist health care, information, and financial support...",
                "approved": True
            }
        )

        save_the_children_org, _ = Organization.objects.get_or_create(
            user=save_the_children_user,
            defaults={
                "name": "Save the Children",
                "charity_number": "213890",
                "description": "Save the Children works to improve the lives of children through better education, health care...",
                "approved": True
            }
        )

        national_trust_org, _ = Organization.objects.get_or_create(
            user=national_trust_user,
            defaults={
                "name": "National Trust",
                "charity_number": "205846",
                "description": "The National Trust works to preserve and protect historic places and spaces...",
                "approved": True
            }
        )

        marie_curie_org, _ = Organization.objects.get_or_create(
            user=marie_curie_user,
            defaults={
                "name": "Marie Curie",
                "charity_number": "207994",
                "description": "Marie Curie provides care and support for people living with terminal illnesses...",
                "approved": True
            }
        )

        charities_aid_foundation_org, _ = Organization.objects.get_or_create(
            user=charities_aid_foundation_user,
            defaults={
                "name": "Charities Aid Foundation",
                "charity_number": "268369",
                "description": "CAF exists to make giving go further, enabling people and businesses to give to causes they care about...",
                "approved": True
            }
        )

        royal_national_lifeboat_institution_org, _ = Organization.objects.get_or_create(
            user=royal_national_lifeboat_institution_user,
            defaults={
                "name": "Royal National Lifeboat Institution (RNLI)",
                "charity_number": "209603",
                "description": "The RNLI provides a 24-hour lifeboat search and rescue service around the UK and Ireland...",
                "approved": True
            }
        )

        rspca_org, _ = Organization.objects.get_or_create(
            user=rspca_user,
            defaults={
                "name": "RSPCA",
                "charity_number": "219099",
                "description": "The RSPCA is the leading animal welfare charity, specializing in rescue, rehabilitation, and rehoming...",
                "approved": True
            }
        )

        arts_council_england_org, _ = Organization.objects.get_or_create(
            user=arts_council_england_user,
            defaults={
                "name": "Arts Council England",
                "charity_number": "1036733",
                "description": "Arts Council England champions, develops, and invests in artistic and cultural experiences...",
                "approved": True
            }
        )

        feeding_britain_org, _ = Organization.objects.get_or_create(
            user=feeding_britain_user,
            defaults={
                "name": "Feeding Britain",
                "charity_number": "1163986",
                "description": "Feeding Britain is working to eliminate hunger and its root causes from the UK...",
                "approved": True
            }
        )

        womans_aid_org, _ = Organization.objects.get_or_create(
            user=womans_aid_user,
            defaults={
                "name": "Women's Aid",
                "charity_number": "1054154",
                "description": "Women's Aid is the national charity working to end domestic abuse against women and children...",
                "approved": True
            }
        )

        youth_sport_trust_org, _ = Organization.objects.get_or_create(
            user=youth_sport_trust_user,
            defaults={
                "name": "Youth Sport Trust",
                "charity_number": "1086915",
                "description": "The Youth Sport Trust is a children's charity working to ensure every child enjoys the life-changing benefits that come from play and sport...",
                "approved": True
            }
        )

        # Create opportunities
        opportunity, created = Opportunity.objects.get_or_create(
            organization=red_cross_org,  
            title="Disaster Relief Volunteer",
            defaults={
                "description": "Assist in emergency response efforts.",
                "requirements": "Basic first aid knowledge preferred.",
                "location_name": "London",
                "start_date": now() + timedelta(days=5),
                "end_date": now() + timedelta(days=30),
                "start_time": 9,
                "end_time": 17,
                "estimated_duration": 8,
                "estimated_effort_ranking": "high",
                "capacity": 10,
            }
        ) 
        if created:  
            opportunity.categories.set([Category.objects.get(name="Community")])

        opportunity, created = Opportunity.objects.get_or_create(
            organization=red_cross_org,
            title="Blood Donation Drive Helper",
            defaults={
                "description": "Support in organizing blood donation events.",
                "requirements": "Good organizational skills.",
                "location_name": "Manchester",
                "start_date": now() + timedelta(days=10),
                "end_date": now() + timedelta(days=20),
                "start_time": 10,
                "end_time": 16,
                "estimated_duration": 6,
                "estimated_effort_ranking": "medium",
                "capacity": 5,
            }
        )
        if created:  
            opportunity.categories.set([Category.objects.get(name="Medical")])


        opportunity, created = Opportunity.objects.get_or_create(
            organization=bhf_org,
            title="Cardiac Health Awareness Campaign",
            defaults={
                "description": "Spread awareness about heart health.",
                "requirements": "Basic medical knowledge preferred.",
                "location_name": "Birmingham",
                "start_date": now() + timedelta(days=15),
                "end_date": now() + timedelta(days=40),
                "start_time": 8,
                "end_time": 14,
                "estimated_duration": 6,
                "estimated_effort_ranking": "low",
                "capacity": 7,
            }
        )
        if created:  
            opportunity.categories.set([Category.objects.get(name="Medical")])


        opportunity, created = Opportunity.objects.get_or_create(
            organization=cancer_research_org,
            title="Cancer Awareness Event Coordinator",
            defaults={
                "description": "Help organize local cancer awareness events.",
                "requirements": "Event planning experience preferred.",
                "location_name": "Leeds",
                "start_date": now() + timedelta(days=7),
                "end_date": now() + timedelta(days=21),
                "start_time": 9,
                "end_time": 15,
                "estimated_duration": 6,
                "estimated_effort_ranking": "medium",
                "capacity": 6,
            }
        )
        if created:  
            opportunity.categories.set([Category.objects.get(name="Medical")])


        opportunity, created = Opportunity.objects.get_or_create(
            organization=alzheimers_society_org,
            title="Memory Café Volunteer",
            defaults={
                "description": "Support people with dementia in a social setting.",
                "requirements": "Patience and good communication skills.",
                "location_name": "Liverpool",
                "start_date": now() + timedelta(days=5),
                "end_date": now() + timedelta(days=60),
                "start_time": 10,
                "end_time": 14,
                "estimated_duration": 4,
                "estimated_effort_ranking": "low",
                "capacity": 4,
            }
        )
        if created:  
            opportunity.categories.set([Category.objects.get(name="Elderly")])


        opportunity, created = Opportunity.objects.get_or_create(
            organization=guide_dogs_org,
            title="Guide Dog Socialization Volunteer",
            defaults={
                "description": "Help train and socialize future guide dogs.",
                "requirements": "Love for animals and patience.",
                "location_name": "Bristol",
                "start_date": now() + timedelta(days=10),
                "end_date": now() + timedelta(days=50),
                "start_time": 8,
                "end_time": 12,
                "estimated_duration": 4,
                "estimated_effort_ranking": "medium",
                "capacity": 3,
            }
        )
        if created:  
            opportunity.categories.set([Category.objects.get(name="Animal")])


        opportunity, created = Opportunity.objects.get_or_create(
            organization=save_the_children_org,
            title="Children's Literacy Tutor",
            defaults={
                "description": "Help children improve their reading skills.",
                "requirements": "Teaching experience preferred.",
                "location_name": "Glasgow",
                "start_date": now() + timedelta(days=10),
                "end_date": now() + timedelta(days=40),
                "start_time": 14,
                "end_time": 17,
                "estimated_duration": 3,
                "estimated_effort_ranking": "medium",
                "capacity": 6,
            }
        )
        if created:  
            opportunity.categories.set([Category.objects.get(name="Educational")])


        opportunity, created = Opportunity.objects.get_or_create(
            organization=rspca_org,
            title="Animal Shelter Volunteer",
            defaults={
                "description": "Help take care of animals at the shelter.",
                "requirements": "Love for animals and responsibility.",
                "location_name": "Edinburgh",
                "start_date": now() + timedelta(days=10),
                "end_date": now() + timedelta(days=60),
                "start_time": 9,
                "end_time": 15,
                "estimated_duration": 6,
                "estimated_effort_ranking": "medium",
                "capacity": 6,
            }
        )
        if created:  
            opportunity.categories.set([Category.objects.get(name="Animal")])


        opportunity, created = Opportunity.objects.get_or_create(
            organization=charities_aid_foundation_org,
            title="Fundraising Campaign Assistant",
            defaults={
                "description": "Support charity fundraising events.",
                "requirements": "Good communication skills.",
                "location_name": "Cardiff",
                "start_date": now() + timedelta(days=14),
                "end_date": now() + timedelta(days=60),
                "start_time": 9,
                "end_time": 17,
                "estimated_duration": 8,
                "estimated_effort_ranking": "medium",
                "capacity": 10,
            }
        )
        if created:  
            opportunity.categories.set([Category.objects.get(name="Community")])


        opportunity, created = Opportunity.objects.get_or_create(
            organization=womans_aid_org,
            title="Domestic Abuse Support Volunteer",
            defaults={
                "description": "Provide assistance to survivors of domestic abuse.",
                "requirements": "Empathy and active listening skills.",
                "location_name": "Newcastle",
                "start_date": now() + timedelta(days=14),
                "end_date": now() + timedelta(days=50),
                "start_time": 10,
                "end_time": 16,
                "estimated_duration": 6,
                "estimated_effort_ranking": "high",
                "capacity": 5,
            }
        )
        if created:  
            opportunity.categories.set([Category.objects.get(name="Community")])


        opportunity, created = Opportunity.objects.get_or_create(
            organization=macmillan_cancer_support_org,
            title="Cancer Support Helpline Volunteer",
            defaults={
                "description": "Provide emotional support to cancer patients via a helpline.",
                "requirements": "Good communication skills and empathy.",
                "location_name": "London",
                "start_date": now() + timedelta(days=7),
                "end_date": now() + timedelta(days=90),
                "start_time": 9,
                "end_time": 17,
                "estimated_duration": 8,
                "estimated_effort_ranking": "high",
                "capacity": 5,
            }
        )
        if created:  
            opportunity.categories.set([Category.objects.get(name="Community")])


        opportunity, created = Opportunity.objects.get_or_create(
            organization=save_the_children_org,
            title="Disaster Response Fundraiser",
            defaults={
                "description": "Help raise funds for emergency response programs.",
                "requirements": "Experience in fundraising or sales preferred.",
                "location_name": "Bristol",
                "start_date": now() + timedelta(days=10),
                "end_date": now() + timedelta(days=50),
                "start_time": 10,
                "end_time": 16,
                "estimated_duration": 6,
                "estimated_effort_ranking": "medium",
                "capacity": 7,
            }
        )
        if created:  
            opportunity.categories.set([Category.objects.get(name="Community")])


        opportunity, created = Opportunity.objects.get_or_create(
            organization=national_trust_org,
            title="Historical Site Tour Guide",
            defaults={
                "description": "Guide visitors through historic properties and share their history.",
                "requirements": "Public speaking skills preferred.",
                "location_name": "York",
                "start_date": now() + timedelta(days=14),
                "end_date": now() + timedelta(days=90),
                "start_time": 9,
                "end_time": 15,
                "estimated_duration": 6,
                "estimated_effort_ranking": "medium",
                "capacity": 8,
            }
        )
        if created:  
            opportunity.categories.set([Category.objects.get(name="Educational")])


        opportunity, created = Opportunity.objects.get_or_create(
            organization=marie_curie_org,
            title="Hospice Support Volunteer",
            defaults={
                "description": "Provide companionship and support in a hospice setting.",
                "requirements": "Compassion and patience required.",
                "location_name": "Manchester",
                "start_date": now() + timedelta(days=7),
                "end_date": now() + timedelta(days=60),
                "start_time": 10,
                "end_time": 14,
                "estimated_duration": 4,
                "estimated_effort_ranking": "low",
                "capacity": 6,
            }
        )
        if created:  
            opportunity.categories.set([Category.objects.get(name="Medical")])


        opportunity, created = Opportunity.objects.get_or_create(
            organization=rspca_org,
            title="Wildlife Rescue Assistant",
            defaults={
                "description": "Help rescue and rehabilitate injured wildlife.",
                "requirements": "Comfort working with animals.",
                "location_name": "Leeds",
                "start_date": now() + timedelta(days=10),
                "end_date": now() + timedelta(days=60),
                "start_time": 9,
                "end_time": 15,
                "estimated_duration": 6,
                "estimated_effort_ranking": "medium",
                "capacity": 5,
            }
        )
        if created:  
            opportunity.categories.set([Category.objects.get(name="Animal")])


        opportunity, created = Opportunity.objects.get_or_create(
            organization=arts_council_england_org,
            title="Art Workshop Facilitator",
            defaults={
                "description": "Lead creative art workshops for children and adults.",
                "requirements": "Experience in visual arts preferred.",
                "location_name": "Liverpool",
                "start_date": now() + timedelta(days=14),
                "end_date": now() + timedelta(days=70),
                "start_time": 10,
                "end_time": 16,
                "estimated_duration": 6,
                "estimated_effort_ranking": "medium",
                "capacity": 5,
            }
        )
        if created:  
            opportunity.categories.set([Category.objects.get(name="Community")])


        opportunity, created = Opportunity.objects.get_or_create(
            organization=feeding_britain_org,
            title="Food Bank Distribution Volunteer",
            defaults={
                "description": "Assist in distributing food to families in need.",
                "requirements": "Ability to lift food boxes.",
                "location_name": "Birmingham",
                "start_date": now() + timedelta(days=7),
                "end_date": now() + timedelta(days=60),
                "start_time": 9,
                "end_time": 14,
                "estimated_duration": 5,
                "estimated_effort_ranking": "medium",
                "capacity": 6,
            }
        )
        if created:  
            opportunity.categories.set([Category.objects.get(name="Community")])


        opportunity, created = Opportunity.objects.get_or_create(
            organization=womans_aid_org,
            title="Support Group Facilitator",
            defaults={
                "description": "Facilitate support groups for survivors of domestic abuse.",
                "requirements": "Counseling experience preferred.",
                "location_name": "Newcastle",
                "start_date": now() + timedelta(days=10),
                "end_date": now() + timedelta(days=90),
                "start_time": 14,
                "end_time": 18,
                "estimated_duration": 4,
                "estimated_effort_ranking": "high",
                "capacity": 5,
            }
        )
        if created:  
            opportunity.categories.set([Category.objects.get(name="Community")])


        opportunity, created = Opportunity.objects.get_or_create(
            organization=youth_sport_trust_org,
            title="Youth Sports Mentor",
            defaults={
                "description": "Support young athletes in developing sports skills and confidence.",
                "requirements": "Experience in coaching or mentoring.",
                "location_name": "Glasgow",
                "start_date": now() + timedelta(days=7),
                "end_date": now() + timedelta(days=50),
                "start_time": 15,
                "end_time": 18,
                "estimated_duration": 3,
                "estimated_effort_ranking": "medium",
                "capacity": 7,
            }
        )
        if created:  
            opportunity.categories.set([Category.objects.get(name="Educational")])


        opportunity, created = Opportunity.objects.get_or_create(
            organization=cancer_research_org,
            title="Cancer Awareness Marathon Organizer",
            defaults={
                "description": "Help organize and manage charity marathons for cancer research.",
                "requirements": "Event planning experience preferred.",
                "location_name": "London",
                "start_date": now() + timedelta(days=20),
                "end_date": now() + timedelta(days=100),
                "start_time": 8,
                "end_time": 17,
                "estimated_duration": 9,
                "estimated_effort_ranking": "high",
                "capacity": 8,
            }
        )
        if created:  
            opportunity.categories.set([Category.objects.get(name="Medical")])


        opportunity, created = Opportunity.objects.get_or_create(
            organization=cancer_research_org,
            title="Lab Research Assistant",
            defaults={
                "description": "Assist researchers in organizing and analyzing cancer research data.",
                "requirements": "Background in biology or medical sciences preferred.",
                "location_name": "Oxford",
                "start_date": now() + timedelta(days=10),
                "end_date": now() + timedelta(days=120),
                "start_time": 9,
                "end_time": 17,
                "estimated_duration": 8,
                "estimated_effort_ranking": "high",
                "capacity": 3,
            }
        )
        if created:  
            opportunity.categories.set([Category.objects.get(name="Medical")])


        opportunity, created = Opportunity.objects.get_or_create(
            organization=alzheimers_society_org,
            title="Dementia Café Support Volunteer",
            defaults={
                "description": "Help run social events for individuals with dementia and their caregivers.",
                "requirements": "Friendly attitude and patience required.",
                "location_name": "Manchester",
                "start_date": now() + timedelta(days=7),
                "end_date": now() + timedelta(days=60),
                "start_time": 10,
                "end_time": 14,
                "estimated_duration": 4,
                "estimated_effort_ranking": "medium",
                "capacity": 6,
            }
        )
        if created:  
            opportunity.categories.set([Category.objects.get(name="Community")])


        opportunity, created = Opportunity.objects.get_or_create(
            organization=guide_dogs_org,
            title="Puppy Socialization Volunteer",
            defaults={
                "description": "Help socialize young guide dog puppies before formal training.",
                "requirements": "Must be able to care for a puppy in your home.",
                "location_name": "Bristol",
                "start_date": now() + timedelta(days=14),
                "end_date": now() + timedelta(days=90),
                "start_time": 8,
                "end_time": 18,
                "estimated_duration": 10,
                "estimated_effort_ranking": "high",
                "capacity": 4,
            }
        )
        if created:  
            opportunity.categories.set([Category.objects.get(name="Animal")])


        opportunity, created = Opportunity.objects.get_or_create(
            organization=macmillan_cancer_support_org,
            title="Hospital Visit Volunteer",
            defaults={
                "description": "Provide companionship to cancer patients receiving treatment.",
                "requirements": "Compassion and good listening skills.",
                "location_name": "Liverpool",
                "start_date": now() + timedelta(days=7),
                "end_date": now() + timedelta(days=90),
                "start_time": 11,
                "end_time": 15,
                "estimated_duration": 4,
                "estimated_effort_ranking": "medium",
                "capacity": 5,
            }
        )
        if created:  
            opportunity.categories.set([Category.objects.get(name="Medical")])


        opportunity, created = Opportunity.objects.get_or_create(
            organization=save_the_children_org,
            title="Children's Literacy Program Volunteer",
            defaults={
                "description": "Help children develop literacy skills through storytelling and reading sessions.",
                "requirements": "Passion for education and working with children.",
                "location_name": "London",
                "start_date": now() + timedelta(days=10),
                "end_date": now() + timedelta(days=50),
                "start_time": 9,
                "end_time": 13,
                "estimated_duration": 4,
                "estimated_effort_ranking": "low",
                "capacity": 6,
            }
        )
        if created:  
            opportunity.categories.set([Category.objects.get(name="Educational")])


        opportunity, created = Opportunity.objects.get_or_create(
            organization=national_trust_org,
            title="Conservation Site Maintenance Volunteer",
            defaults={
                "description": "Assist with conservation efforts at historic sites and national parks.",
                "requirements": "Physical fitness and interest in environmental work.",
                "location_name": "Yorkshire Dales",
                "start_date": now() + timedelta(days=14),
                "end_date": now() + timedelta(days=120),
                "start_time": 8,
                "end_time": 16,
                "estimated_duration": 8,
                "estimated_effort_ranking": "high",
                "capacity": 7,
            }
        )
        if created:  
            opportunity.categories.set([Category.objects.get(name="Greener Planet")])


        opportunity, created = Opportunity.objects.get_or_create(
            organization=marie_curie_org,
            title="Bereavement Support Volunteer",
            defaults={
                "description": "Support individuals coping with grief after losing a loved one.",
                "requirements": "Training provided, but empathy and good listening skills are essential.",
                "location_name": "Edinburgh",
                "start_date": now() + timedelta(days=7),
                "end_date": now() + timedelta(days=100),
                "start_time": 10,
                "end_time": 14,
                "estimated_duration": 4,
                "estimated_effort_ranking": "medium",
                "capacity": 5,
            }
        )
        if created:  
            opportunity.categories.set([Category.objects.get(name="Medical")])


        opportunity, created = Opportunity.objects.get_or_create(
            organization=royal_national_lifeboat_institution_org,
            title="Water Safety Education Volunteer",
            defaults={
                "description": "Deliver water safety talks at schools and community centers.",
                "requirements": "Public speaking skills and enthusiasm for safety education.",
                "location_name": "Plymouth",
                "start_date": now() + timedelta(days=10),
                "end_date": now() + timedelta(days=90),
                "start_time": 9,
                "end_time": 14,
                "estimated_duration": 5,
                "estimated_effort_ranking": "low",
                "capacity": 6,
            }
        )
        if created:  
            opportunity.categories.set([Category.objects.get(name="Educational")])


        opportunity, created = Opportunity.objects.get_or_create(
            organization=rspca_org,
            title="Pet Foster Carer",
            defaults={
                "description": "Provide temporary care for rescued animals before they find a permanent home.",
                "requirements": "Space at home for fostering and ability to care for animals.",
                "location_name": "Sheffield",
                "start_date": now() + timedelta(days=7),
                "end_date": now() + timedelta(days=180),
                "start_time": 0,  # Full-day responsibility
                "end_time": 23,  # Full-day responsibility
                "estimated_duration": 24,
                "estimated_effort_ranking": "high",
                "capacity": 5,
            }
        )
        if created:  
            opportunity.categories.set([Category.objects.get(name="Animal")])



         # Create Volunteers
        volunteers = [
        {
            "email": "john.doe@gmail.com",
            "first_name": "John",
            "last_name": "Doe",
            "username": "john_doe",
            "display_name": "JohnD"
        },
        {
            "email": "sarah.smith@gmail.com",
            "first_name": "Sarah",
            "last_name": "Smith",
            "username": "sarah_smith",
            "display_name": "SarahS"
        },
        {
            "email": "michael.johnson@gmail.com",
            "first_name": "Michael",
            "last_name": "Johnson",
            "username": "michael_johnson",
            "display_name": "MikeJ"
        },
        {
            "email": "emily.watson@gmail.com",
            "first_name": "Emily",
            "last_name": "Watson",
            "username": "emily_watson",
            "display_name": "EmilyW"
        },
        {
            "email": "david.brown@gmail.com",
            "first_name": "David",
            "last_name": "Brown",
            "username": "david_brown",
            "display_name": "DaveB"
        },
        {
            "email": "jessica.taylor@gmail.com",
            "first_name": "Jessica",
            "last_name": "Taylor",
            "username": "jessica_taylor",
            "display_name": "JessT"
        },
        {
            "email": "chris.evans@gmail.com",
            "first_name": "Chris",
            "last_name": "Evans",
            "username": "chris_evans",
            "display_name": "ChrisE"
        },
        {
            "email": "amanda.white@gmail.com",
            "first_name": "Amanda",
            "last_name": "White",
            "username": "amanda_white",
            "display_name": "MandyW"
        },
        {
            "email": "daniel.harris@gmail.com",
            "first_name": "Daniel",
            "last_name": "Harris",
            "username": "daniel_harris",
            "display_name": "DanH"
        },
        {
            "email": "laura.moore@gmail.com",
            "first_name": "Laura",
            "last_name": "Moore",
            "username": "laura_moore",
            "display_name": "LauraM"
        },
        {
            "email": "james.anderson@gmail.com",
            "first_name": "James",
            "last_name": "Anderson",
            "username": "james_anderson",
            "display_name": "JimA"
        },
        {
            "email": "megan.thomas@gmail.com",
            "first_name": "Megan",
            "last_name": "Thomas",
            "username": "megan_thomas",
            "display_name": "MeganT"
        },
        {
            "email": "alex.martin@gmail.com",
            "first_name": "Alex",
            "last_name": "Martin",
            "username": "alex_martin",
            "display_name": "AlexM"
        },
        {
            "email": "rebecca.lee@gmail.com",
            "first_name": "Rebecca",
            "last_name": "Lee",
            "username": "rebecca_lee",
            "display_name": "BeccaL"
        },
        {
            "email": "ryan.clark@gmail.com",
            "first_name": "Ryan",
            "last_name": "Clark",
            "username": "ryan_clark",
            "display_name": "RyanC"
        },
        {
            "email": "samantha.adams@gmail.com",
            "first_name": "Samantha",
            "last_name": "Adams",
            "username": "samantha_adams",
            "display_name": "SamA"
        },
        {
            "email": "kevin.roberts@gmail.com",
            "first_name": "Kevin",
            "last_name": "Roberts",
            "username": "kevin_roberts",
            "display_name": "KevR"
        },
        {
            "email": "olivia.hall@gmail.com",
            "first_name": "Olivia",
            "last_name": "Hall",
            "username": "olivia_hall",
            "display_name": "OliviaH"
        },
        {
            "email": "brian.wright@gmail.com",
            "first_name": "Brian",
            "last_name": "Wright",
            "username": "brian_wright",
            "display_name": "BrianW"
        },
        {
            "email": "zoe.green@gmail.com",
            "first_name": "Zoe",
            "last_name": "Green",
            "username": "zoe_green",
            "display_name": "ZoeG"
        },
        {
            "email": "brandon.walker@gmail.com",
            "first_name": "Brandon",
            "last_name": "Walker",
            "username": "brandon_walker",
            "display_name": "BrandonW"
        },
            {
            "email": "natalie.king@gmail.com",
            "first_name": "Natalie",
            "last_name": "King",
            "username": "natalie_king",
            "display_name": "NatK"
        },
        {
            "email": "ethan.wood@gmail.com",
            "first_name": "Ethan",
            "last_name": "Wood",
            "username": "ethan_wood",
            "display_name": "EthanW"
        },
        {
            "email": "melissa.baker@gmail.com",
            "first_name": "Melissa",
            "last_name": "Baker",
            "username": "melissa_baker",
            "display_name": "MelB"
        },
        {
            "email": "tyler.hill@gmail.com",
            "first_name": "Tyler",
            "last_name": "Hill",
            "username": "tyler_hill",
            "display_name": "TylerH"
        },
        {
            "email": "victoria.young@gmail.com",
            "first_name": "Victoria",
            "last_name": "Young",
            "username": "victoria_young",
            "display_name": "VickyY"
        },
        {
            "email": "sean.carter@gmail.com",
            "first_name": "Sean",
            "last_name": "Carter",
            "username": "sean_carter",
            "display_name": "SeanC"
        },
        {
            "email": "grace.morris@gmail.com",
            "first_name": "Grace",
            "last_name": "Morris",
            "username": "grace_morris",
            "display_name": "GraceM"
        },
        {
            "email": "jackson.cooper@gmail.com",
            "first_name": "Jackson",
            "last_name": "Cooper",
            "username": "jackson_cooper",
            "display_name": "JackC"
        },
        {
            "email": "noah.bennett@gmail.com",
            "first_name": "Noah",
            "last_name": "Bennett",
            "username": "noah_bennett",
            "display_name": "NoahB"
        },
        {
            "email": "sophia.coleman@gmail.com",
            "first_name": "Sophia",
            "last_name": "Coleman",
            "username": "sophia_coleman",
            "display_name": "SophiaC"
        },
        {
            "email": "liam.foster@gmail.com",
            "first_name": "Liam",
            "last_name": "Foster",
            "username": "liam_foster",
            "display_name": "LiamF"
        },
        {
            "email": "ava.campbell@gmail.com",
            "first_name": "Ava",
            "last_name": "Campbell",
            "username": "ava_campbell",
            "display_name": "AvaC"
        },
        {
            "email": "mason.perry@gmail.com",
            "first_name": "Mason",
            "last_name": "Perry",
            "username": "mason_perry",
            "display_name": "MasonP"
        },
        {
            "email": "ella.richards@gmail.com",
            "first_name": "Ella",
            "last_name": "Richards",
            "username": "ella_richards",
            "display_name": "EllaR"
        },
        {
            "email": "lucas.hughes@gmail.com",
            "first_name": "Lucas",
            "last_name": "Hughes",
            "username": "lucas_hughes",
            "display_name": "LucasH"
        },
        {
            "email": "mia.turner@gmail.com",
            "first_name": "Mia",
            "last_name": "Turner",
            "username": "mia_turner",
            "display_name": "MiaT"
        },
        {
            "email": "henry.morris@gmail.com",
            "first_name": "Henry",
            "last_name": "Morris",
            "username": "henry_morris",
            "display_name": "HenryM"
        },
        {
            "email": "charlotte.martinez@gmail.com",
            "first_name": "Charlotte",
            "last_name": "Martinez",
            "username": "charlotte_martinez",
            "display_name": "CharlieM"
        },
        {
            "email": "benjamin.cox@gmail.com",
            "first_name": "Benjamin",
            "last_name": "Cox",
            "username": "benjamin_cox",
            "display_name": "BenC"
        },
        {
            "email": "scarlett.harrison@gmail.com",
            "first_name": "Scarlett",
            "last_name": "Harrison",
            "username": "scarlett_harrison",
            "display_name": "ScarlettH"
        },
        {
            "email": "jacob.ellis@gmail.com",
            "first_name": "Jacob",
            "last_name": "Ellis",
            "username": "jacob_ellis",
            "display_name": "JakeE"
        },
        {
            "email": "isabella.ross@gmail.com",
            "first_name": "Isabella",
            "last_name": "Ross",
            "username": "isabella_ross",
            "display_name": "IzzyR"
        },
        {
            "email": "oliver.bryant@gmail.com",
            "first_name": "Oliver",
            "last_name": "Bryant",
            "username": "oliver_bryant",
            "display_name": "OllieB"
        },
        {
            "email": "grace.ramirez@gmail.com",
            "first_name": "Grace",
            "last_name": "Ramirez",
            "username": "grace_ramirez",
            "display_name": "GraceR"
        },
        {
            "email": "daniel.mitchell@gmail.com",
            "first_name": "Daniel",
            "last_name": "Mitchell",
            "username": "daniel_mitchell",
            "display_name": "DannyM"
        },
        {
            "email": "harper.carter@gmail.com",
            "first_name": "Harper",
            "last_name": "Carter",
            "username": "harper_carter",
            "display_name": "HarperC"
        },
        {
            "email": "samuel.walker@gmail.com",
            "first_name": "Samuel",
            "last_name": "Walker",
            "username": "samuel_walker",
            "display_name": "SamW"
        },
        {
            "email": "lily.bailey@gmail.com",
            "first_name": "Lily",
            "last_name": "Bailey",
            "username": "lily_bailey",
            "display_name": "LilyB"
        },
        {
            "email": "ethan.king@gmail.com",
            "first_name": "Ethan",
            "last_name": "King",
            "username": "ethan_king",
            "display_name": "EthanK"
        },
        {
            "email": "chloe.green@gmail.com",
            "first_name": "Chloe",
            "last_name": "Green",
            "username": "chloe_green",
            "display_name": "ChloeG"
        },
        {
            "email": "jackson.scott@gmail.com",
            "first_name": "Jackson",
            "last_name": "Scott",
            "username": "jackson_scott",
            "display_name": "JackS"
        },
        {
            "email": "violet.baker@gmail.com",
            "first_name": "Violet",
            "last_name": "Baker",
            "username": "violet_baker",
            "display_name": "VioletB"
        },
        {
            "email": "andrew.adams@gmail.com",
            "first_name": "Andrew",
            "last_name": "Adams",
            "username": "andrew_adams",
            "display_name": "AndyA"
        },
        {
            "email": "madison.roberts@gmail.com",
            "first_name": "Madison",
            "last_name": "Roberts",
            "username": "madison_roberts",
            "display_name": "MaddyR"
        },
        {
            "email": "leo.jenkins@gmail.com",
            "first_name": "Leo",
            "last_name": "Jenkins",
            "username": "leo_jenkins",
            "display_name": "LeoJ"
        },
        {
            "email": "hazel.ward@gmail.com",
            "first_name": "Hazel",
            "last_name": "Ward",
            "username": "hazel_ward",
            "display_name": "HazelW"
        },
        {
            "email": "dylan.cooper@gmail.com",
            "first_name": "Dylan",
            "last_name": "Cooper",
            "username": "dylan_cooper",
            "display_name": "DylanC"
        }
    ]

        for vol_data in volunteers:
            user, _ = User.objects.get_or_create(email=vol_data["email"], first_name=vol_data["first_name"], last_name=vol_data["last_name"], defaults={"username": vol_data["username"]})
            user.set_password("1234")
            user.save()
            volunteer, _ = Volunteer.objects.get_or_create(user=user, display_name=vol_data["display_name"])

    
        elderly = Category.objects.get(name = "Elderly")
        animals = Category.objects.get(name = "Animal")
        sports = Category.objects.get(name = "Sports")
        education = Category.objects.get(name = "Educational")
        community = Category.objects.get(name = "Community")
        greener_planet = Category.objects.get(name = "Greener Planet")
        disability = Category.objects.get(name = "Disability")
        medical = Category.objects.get(name = "Medical")

        interests = [
            {
                'name': 'Elderly',
                'category': elderly,
                'description': 'Helping the elderly people to bring kindness into the world'
            },
            {
                'name': 'Animals',
                'category': animals,
                'description': 'Caring for and protecting animals in need'
            },
            {
                'name': 'Sports',
                'category': sports,
                'description': 'Encouraging fitness, teamwork, and sportsmanship'
            },
            {
                'name': 'Education',
                'category': education,
                'description': 'Providing learning opportunities for all ages'
            },
            {
                'name': 'Community',
                'category': community,
                'description': 'Building stronger, more connected local communities'
            },
            {
                'name': 'Greener Planet',
                'category': greener_planet,
                'description': 'Promoting sustainability and environmental awareness'
            },
            {
                'name': 'Disability',
                'category': disability,
                'description': 'Supporting individuals with disabilities and advocating for accessibility'
            },
            {
                'name': 'Medical',
                'category': medical,
                'description': 'Assisting healthcare initiatives and improving public health'
            },
            {
                'name': 'Senior Companion',
                'category': elderly,
                'description': 'Spending time with elderly individuals to provide companionship and support.'
            },
            {
                'name': 'Wildlife Conservation',
                'category': animals,
                'description': 'Helping protect wildlife and their habitats through conservation efforts.'
            },
            {
                'name': 'Youth Sports Coach',
                'category': sports,
                'description': 'Coaching or mentoring young athletes in various sports.'
            },
            {
                'name': 'Tutoring Underprivileged Children',
                'category': education,
                'description': 'Providing academic support to children from disadvantaged backgrounds.'
            },
            {
                'name': 'Community Cleanup Leader',
                'category': community,
                'description': 'Organizing and leading efforts to clean up local parks, streets, and public areas.'
            },
            {
                'name': 'Tree Planting Volunteer',
                'category': greener_planet,
                'description': 'Taking part in reforestation and environmental sustainability projects.'
            },
            {
                'name': 'Disability Support Assistant',
                'category': disability,
                'description': 'Assisting individuals with disabilities in daily activities and social integration.'
            },
            {
                'name': 'First Aid Responder',
                'category': medical,
                'description': 'Providing basic medical aid and support at events or in the community.'
            },
            {
                'name': 'Animal Shelter Helper',
                'category': animals,
                'description': 'Caring for abandoned or rescued animals at local shelters.'
            },
            {
                'name': 'Mental Health Advocate',
                'category': medical,
                'description': 'Raising awareness and offering peer support for mental health initiatives.'
            }
        ]

        for inter in interests:
            Interest.objects.get_or_create(name = inter['name'], category = inter['category'], description = inter['description'])