import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import { MessageCircle, Car, CircleAlert as AlertCircle, Calendar } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '@/constants/colors';
import { FONTS, SHADOWS, SIZES } from '@/constants/theme';

const carModels = [
  {
    id: '1',
    name: 'IONIQ 5',
    image: 'https://images.pexels.com/photos/12861709/pexels-photo-12861709.jpeg',
    type: 'Electric',
    price: 'Starting at $41,450',
    specs: {
      range: '303 miles',
      power: '168-320 hp',
      charging: '10-80% in 18 minutes',
    },
    offerUrl: 'https://www.hyundai.com/ksa/en/model/ioniq5',
  },
  {
    id: '2',
    name: 'Santa Fe',
    image: 'https://images.pexels.com/photos/13861958/pexels-photo-13861958.jpeg',
    type: 'SUV',
    price: 'Starting at $28,200',
    specs: {
      engine: '2.5L 4-cylinder',
      power: '191-277 hp',
      transmission: '8-speed automatic',
    },
    offerUrl: 'https://www.hyundai.com/ksa/en/model/santa-fe',
  },
  {
    id: '3',
    name: 'Tucson',
    image: 'https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg',
    type: 'SUV',
    price: 'Starting at $26,450',
    specs: {
      engine: '2.5L 4-cylinder',
      power: '187 hp',
      transmission: '8-speed automatic',
    },
    offerUrl: 'https://www.hyundai.com/ksa/en/model/tucson',
  },
];

const quickLinks = [
  {
    id: '1',
    title: 'Test Drive',
    icon: Calendar,
    color: '#E8F4FF',
    borderColor: '#B7D7FF',
    onPress: () => {
      Linking.openURL('https://www.hyundai.com/ksa/en/test-drive');
    },
  },
  {
    id: '2',
    title: 'Explore Models',
    icon: Car,
    color: '#E6F7ED',
    borderColor: '#B7E1C5',
    onPress: () => {
      Linking.openURL('https://www.hyundai.com/ksa/en/models');
    },
  },
  {
    id: '3',
    title: 'Support',
    icon: AlertCircle,
    color: '#FFF4E5',
    borderColor: '#FFD8A8',
    onPress: () => {
      Linking.openURL('https://www.hyundai.com/ksa/en/customer-service');
    },
  },
];

export default function HomeScreen() {
  const handleModelPress = (model) => {
    // Open model details in a modal or new screen
    console.log('Model pressed:', model.name);
  };

  const handleOfferPress = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <LinearGradient
          colors={[COLORS.gradientStart, COLORS.gradientEnd]}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <Text style={styles.welcomeText}>Welcome to</Text>
            <Text style={styles.brandText}>Hyundai KSA</Text>
            <Text style={styles.subtitleText}>
              Discover our latest models and offers
            </Text>
          </View>
        </LinearGradient>
        
        {/* Quick Links */}
        <View style={styles.quickLinksContainer}>
          {quickLinks.map((link) => (
            <TouchableOpacity
              key={link.id}
              style={[
                styles.quickLinkButton,
                { backgroundColor: link.color, borderColor: link.borderColor }
              ]}
              onPress={link.onPress}
            >
              <link.icon size={24} color={COLORS.primary} />
              <Text style={styles.quickLinkText}>{link.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
        
        {/* Featured Models Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Models</Text>
            <TouchableOpacity onPress={() => Linking.openURL('https://www.hyundai.com/ksa/en/models')}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.modelsScrollContainer}
          >
            {carModels.map((model) => (
              <TouchableOpacity 
                key={model.id} 
                style={styles.modelCard}
                onPress={() => handleModelPress(model)}
              >
                <Image
                  source={{ uri: model.image }}
                  style={styles.modelImage}
                  resizeMode="cover"
                />
                <View style={styles.modelInfo}>
                  <Text style={styles.modelName}>{model.name}</Text>
                  <Text style={styles.modelPrice}>{model.price}</Text>
                  <View style={styles.modelTypeContainer}>
                    <Text style={styles.modelType}>{model.type}</Text>
                  </View>
                  
                  <View style={styles.specsContainer}>
                    {Object.entries(model.specs).map(([key, value]) => (
                      <Text key={key} style={styles.specText}>
                        {key}: {value}
                      </Text>
                    ))}
                  </View>
                  
                  <TouchableOpacity 
                    style={styles.learnMoreButton}
                    onPress={() => handleOfferPress(model.offerUrl)}
                  >
                    <Text style={styles.learnMoreText}>View Offer</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        
        {/* Special Offers Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Special Offers</Text>
            <TouchableOpacity onPress={() => Linking.openURL('https://www.hyundai.com/ksa/en/offers')}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.offerCard}>
            <LinearGradient
              colors={[COLORS.gradientStart, COLORS.gradientEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.offerGradient}
            >
              <View style={styles.offerContent}>
                <Text style={styles.offerTitle}>Summer Special</Text>
                <Text style={styles.offerDescription}>
                  Get up to 15% discount on selected Hyundai models
                </Text>
                <TouchableOpacity 
                  style={styles.offerButton}
                  onPress={() => Linking.openURL('https://www.hyundai.com/ksa/en/offers/summer-special')}
                >
                  <Text style={styles.offerButtonText}>View Offers</Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>
        </View>
      </ScrollView>
      
      {/* Floating Chat Button */}
      <Link href="/chat" asChild>
        <TouchableOpacity style={styles.chatButton}>
          <LinearGradient
            colors={[COLORS.gradientStart, COLORS.gradientEnd]}
            style={styles.chatButtonGradient}
          >
            <MessageCircle size={24} color={COLORS.white} />
          </LinearGradient>
        </TouchableOpacity>
      </Link>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.ultraLightGray,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    height: 200,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
  },
  headerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  welcomeText: {
    ...FONTS.body2,
    color: COLORS.white,
    opacity: 0.9,
  },
  brandText: {
    ...FONTS.largeTitle,
    color: COLORS.white,
    marginTop: 8,
  },
  subtitleText: {
    ...FONTS.body3,
    color: COLORS.white,
    opacity: 0.8,
    marginTop: 8,
  },
  quickLinksContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: -30,
  },
  quickLinkButton: {
    width: SIZES.width / 3.5,
    height: 100,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    ...SHADOWS.medium,
  },
  quickLinkText: {
    ...FONTS.body3,
    color: COLORS.black,
    marginTop: 8,
    textAlign: 'center',
  },
  sectionContainer: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    ...FONTS.h2,
    color: COLORS.black,
  },
  viewAllText: {
    ...FONTS.body3,
    color: COLORS.primary,
  },
  modelsScrollContainer: {
    paddingBottom: 16,
  },
  modelCard: {
    width: 280,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 16,
    ...SHADOWS.medium,
  },
  modelImage: {
    width: '100%',
    height: 160,
  },
  modelInfo: {
    padding: 16,
  },
  modelName: {
    ...FONTS.h3,
    color: COLORS.black,
  },
  modelPrice: {
    ...FONTS.body3,
    color: COLORS.primary,
    marginTop: 4,
  },
  modelTypeContainer: {
    backgroundColor: COLORS.ultraLightGray,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  modelType: {
    ...FONTS.body4,
    color: COLORS.gray,
  },
  specsContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  specText: {
    ...FONTS.body4,
    color: COLORS.gray,
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  learnMoreButton: {
    marginTop: 16,
    backgroundColor: COLORS.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  learnMoreText: {
    ...FONTS.body3,
    color: COLORS.white,
  },
  offerCard: {
    borderRadius: 16,
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  offerGradient: {
    padding: 20,
  },
  offerContent: {
    alignItems: 'flex-start',
  },
  offerTitle: {
    ...FONTS.h2,
    color: COLORS.white,
  },
  offerDescription: {
    ...FONTS.body3,
    color: COLORS.white,
    opacity: 0.9,
    marginTop: 8,
    marginBottom: 16,
  },
  offerButton: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  offerButtonText: {
    ...FONTS.body3,
    color: COLORS.primary,
  },
  chatButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    ...SHADOWS.dark,
  },
  chatButtonGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});